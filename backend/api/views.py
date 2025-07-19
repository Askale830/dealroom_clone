from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Sum, Avg
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils import timezone
from decimal import Decimal
import json
from .models import Company, Industry, Person, Investor, FundingRound, FundingRoundParticipation, CuratedContent, EcosystemBuilderRegistration, Hub, Incubator, Accelerator, University, OrganizationRegistration, Contact
from .serializers import (
    CompanySerializer, CompanyListSerializer, IndustrySerializer, 
    PersonSerializer, InvestorSerializer, FundingRoundSerializer,
    UserSerializer, CustomTokenObtainPairSerializer, CuratedContentSerializer, EcosystemBuilderRegistrationSerializer, HubSerializer, IncubatorSerializer, AcceleratorSerializer, UniversitySerializer, OrganizationRegistrationSerializer, ContactSerializer, ContactAdminSerializer
)

@api_view(['GET'])
def test_connection(request):
    """Simple test endpoint to verify API is working"""
    return Response({
        'message': 'Backend API is working!',
        'status': 'success',
        'timestamp': str(timezone.now())
    })

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user': UserSerializer(user).data,
                'message': 'User created successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DashboardView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            # Only count accepted entries
            total_companies = Company.objects.filter(moderation_status='accepted').count()
            total_investors = Investor.objects.filter(moderation_status='accepted').count()
            active_companies = Company.objects.filter(status='Operating', moderation_status='accepted').count()
            total_hubs = Hub.objects.filter(moderation_status='accepted').count()
            total_incubators = Incubator.objects.filter(moderation_status='accepted').count()
            total_accelerators = Accelerator.objects.filter(moderation_status='accepted').count()
            total_universities = University.objects.filter(moderation_status='accepted').count()
            total_rounds = FundingRound.objects.filter(company__moderation_status='accepted').count()

            # Get total funding - handle None values
            total_funding_result = Company.objects.filter(moderation_status='accepted').aggregate(total=Sum('total_funding_raised_usd'))
            total_funding = float(total_funding_result['total'] or 0)
            
            # Get recent companies
            recent_companies = Company.objects.filter(moderation_status='accepted').order_by('-created_at')[:5]
            recent_companies_data = []
            for company in recent_companies:
                recent_companies_data.append({
                    'id': company.id,
                    'name': company.name or '',
                    'short_description': company.short_description or '',
                    'slug': company.slug or '',
                })
            
            # Get recent funding rounds
            recent_funding = FundingRound.objects.select_related('company').filter(
                company__moderation_status='accepted'
            ).order_by('-announced_date')[:5]
            recent_funding_data = []
            for round_obj in recent_funding:
                recent_funding_data.append({
                    'id': round_obj.id,
                    'company_name': round_obj.company.name if round_obj.company else '',
                    'round_type': round_obj.round_type or '',
                    'announced_date': round_obj.announced_date.isoformat() if round_obj.announced_date else '',
                    'money_raised_usd': float(round_obj.money_raised_usd or 0),
                })
            
            # Get industry stats
            industry_stats = []
            industries = Industry.objects.filter(moderation_status='accepted').annotate(
                company_count=Count('companies', filter=Q(companies__moderation_status='accepted'))
            ).order_by('-company_count')[:10]
            for industry in industries:
                if industry.company_count > 0:
                    industry_stats.append({
                        'name': industry.name or '',
                        'company_count': industry.company_count,
                    })
            
            response_data = {
                'overview': {
                    'total_companies': total_companies,
                    'total_investors': total_investors,
                    'total_funding': total_funding,
                    'active_companies': active_companies,
                    'total_hubs': total_hubs,
                    'total_incubators': total_incubators,
                    'total_accelerators': total_accelerators,
                    'total_universities': total_universities,
                    'total_rounds': total_rounds,
                },
                'recent_companies': recent_companies_data,
                'recent_funding': recent_funding_data,
                'industry_stats': industry_stats,
                'monthly_funding': []
            }
            
            return Response(response_data)
            
        except Exception as e:
            print(f"Dashboard error: {str(e)}")
            return Response({
                'overview': {
                    'total_companies': 0,
                    'total_investors': 0,
                    'total_funding': 0,
                    'active_companies': 0,
                    'total_hubs': 0,
                    'total_incubators': 0,
                    'total_accelerators': 0,
                    'total_universities': 0,
                    'total_rounds': 0,
                },
                'recent_companies': [],
                'recent_funding': [],
                'industry_stats': [],
                'monthly_funding': [],
                'error': str(e)
            })

class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'company_type', 'hq_country', 'hq_city', 'industries', 'moderation_status']
    search_fields = ['name', 'short_description', 'description']
    ordering_fields = ['name', 'founded_date', 'total_funding_raised_usd', 'created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CompanyListSerializer
        return CompanySerializer

    def get_queryset(self):
        queryset = Company.objects.all().order_by('name')
        
        # If this is a list action, apply filters
        if self.action == 'list':
            # Get moderation_status from query params, default to 'accepted'
            moderation_status = self.request.query_params.get('moderation_status', 'accepted')
            
            # If 'all' is specified, return all companies
            if moderation_status == 'all':
                return queryset
            
            # Otherwise filter by the specified moderation_status
            return queryset.filter(moderation_status=moderation_status)
            
        return queryset
        
    def create(self, request, *args, **kwargs):
        """
        Custom create method to handle company creation with better error handling
        """
        print("Received company creation request with data:", request.data)
        
        try:
            # Create a serializer with the request data
            serializer = self.get_serializer(data=request.data)
            
            # Validate the data
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                return Response(
                    {"detail": "Invalid data", "errors": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Save the company
            company = serializer.save()
            print(f"Company created successfully: {company.name} (ID: {company.id})")
            
            # Return the created company data
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            print(f"Error creating company: {str(e)}")
            return Response(
                {"detail": f"Error creating company: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        try:
            total_companies = Company.objects.filter(moderation_status='accepted').count()
            total_funding_result = Company.objects.filter(moderation_status='accepted').aggregate(total=Sum('total_funding_raised_usd'))
            total_funding = float(total_funding_result['total'] or 0)
            
            by_status = []
            status_data = Company.objects.filter(moderation_status='accepted').values('status').annotate(count=Count('id')).order_by('-count')
            for item in status_data:
                by_status.append({
                    'status': item['status'] or 'Unknown',
                    'count': item['count']
                })
            
            by_country = []
            country_data = Company.objects.filter(moderation_status='accepted').values('hq_country').annotate(count=Count('id')).order_by('-count')[:10]
            for item in country_data:
                by_country.append({
                    'hq_country': item['hq_country'] or 'Unknown',
                    'count': item['count']
                })
            
            return Response({
                'total_companies': total_companies,
                'total_funding_usd': total_funding,
                'by_status': by_status,
                'by_country': by_country
            })
        except Exception as e:
            return Response({
                'total_companies': 0,
                'total_funding_usd': 0,
                'by_status': [],
                'by_country': [],
                'error': str(e)
            })

class IndustryViewSet(viewsets.ModelViewSet):
    serializer_class = IndustrySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        if self.action == 'list':
            return Industry.objects.filter(moderation_status='accepted').order_by('name')
        return Industry.objects.all().order_by('name')
    
    @action(detail=True, methods=['get'])
    def companies(self, request, pk=None):
        industry = self.get_object()
        companies = industry.companies.filter(moderation_status='accepted')
        serializer = CompanyListSerializer(companies, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def sectors(self, request):
        """Get industry sectors with company counts"""
        sectors = Industry.objects.filter(parent_industry=None, moderation_status='accepted').annotate(
            company_count=Count('companies', filter=Q(companies__moderation_status='accepted')) + 
            Count('child_industries__companies', filter=Q(child_industries__companies__moderation_status='accepted'))
        ).order_by('-company_count')
        
        return Response([
            {
                'id': sector.id,
                'name': sector.name,
                'slug': sector.slug,
                'description': sector.description,
                'company_count': sector.company_count,
                'sub_industries': [
                    {
                        'id': sub.id,
                        'name': sub.name,
                        'company_count': sub.companies.filter(moderation_status='accepted').count()
                    }
                    for sub in sector.child_industries.filter(moderation_status='accepted')
                ]
            }
            for sector in sectors
        ])

class PersonViewSet(viewsets.ModelViewSet):
    serializer_class = PersonSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['full_name', 'bio']
    ordering_fields = ['full_name', 'created_at']

    def get_queryset(self):
        if self.action == 'list':
            return Person.objects.filter(moderation_status='accepted').order_by('full_name')
        return Person.objects.all().order_by('full_name')

class InvestorViewSet(viewsets.ModelViewSet):
    serializer_class = InvestorSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['investor_type', 'hq_country', 'hq_city', 'moderation_status']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        if self.action == 'list':
            return Investor.objects.filter(moderation_status='accepted').order_by('name')
        return Investor.objects.all().order_by('name')
    
    @action(detail=True, methods=['get'])
    def portfolio(self, request, pk=None):
        investor = self.get_object()
        funding_rounds = FundingRound.objects.filter(
            fundingroundparticipation__investor=investor
        ).select_related('company').distinct()
        companies = [fr.company for fr in funding_rounds if fr.company.moderation_status == 'accepted']
        serializer = CompanyListSerializer(companies, many=True)
        return Response(serializer.data)

class FundingRoundViewSet(viewsets.ModelViewSet):
    queryset = FundingRound.objects.all().order_by('-announced_date')
    serializer_class = FundingRoundSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['round_type', 'company']
    search_fields = ['company__name', 'notes']
    ordering_fields = ['announced_date', 'money_raised_usd']
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        recent_rounds = self.queryset.filter(company__moderation_status='accepted')[:20]
        serializer = self.get_serializer(recent_rounds, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def transactions(self, request):
        """Get transaction data for the transactions page"""
        transactions = FundingRound.objects.select_related('company').prefetch_related(
            'fundingroundparticipation_set__investor'
        ).filter(company__moderation_status='accepted').order_by('-announced_date')
        
        round_type = request.query_params.get('round_type')
        if round_type:
            transactions = transactions.filter(round_type=round_type)
            
        year = request.query_params.get('year')
        if year:
            transactions = transactions.filter(announced_date__year=year)
        
        page = self.paginate_queryset(transactions)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)

class EcosystemView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get ecosystem overview data"""
        try:
            total_companies = Company.objects.filter(moderation_status='accepted').count()
            total_funding = Company.objects.filter(moderation_status='accepted').aggregate(
                total=Sum('total_funding_raised_usd')
            )['total'] or 0
            
            from datetime import datetime, timedelta
            current_year = datetime.now().year
            last_year = current_year - 1
            
            companies_this_year = Company.objects.filter(
                created_at__year=current_year, moderation_status='accepted'
            ).count()
            companies_last_year = Company.objects.filter(
                created_at__year=last_year, moderation_status='accepted'
            ).count()
            
            funding_this_year = FundingRound.objects.filter(
                announced_date__year=current_year, company__moderation_status='accepted'
            ).aggregate(total=Sum('money_raised_usd'))['total'] or 0
            
            top_industries = Industry.objects.filter(moderation_status='accepted').annotate(
                company_count=Count('companies', filter=Q(companies__moderation_status='accepted')),
                total_funding=Sum('companies__total_funding_raised_usd', filter=Q(companies__moderation_status='accepted'))
            ).order_by('-company_count')[:10]
            
            geographic_data = Company.objects.filter(moderation_status='accepted').values('hq_city', 'hq_country').annotate(
                count=Count('id'),
                total_funding=Sum('total_funding_raised_usd')
            ).order_by('-count')[:20]
            
            return Response({
                'overview': {
                    'total_companies': total_companies,
                'total_funding': float(total_funding) if total_funding else 0,
                'companies_this_year': companies_this_year,
                'companies_last_year': companies_last_year,
                'funding_this_year': float(funding_this_year) if funding_this_year else 0,
                'growth_rate': ((companies_this_year - companies_last_year) / max(companies_last_year, 1)) * 100 if companies_last_year > 0 else 0
            },
            'top_industries': [
                {
                    'name': industry.name,
                    'company_count': industry.company_count,
                    'total_funding': float(industry.total_funding) if industry.total_funding else 0
                }
                for industry in top_industries
            ],
            'geographic_distribution': list(geographic_data)
        })
        except Exception as e:
            return Response({
                'error': str(e),
                'overview': {
                    'total_companies': 0,
                    'total_funding': 0,
                    'companies_this_year': 0,
                    'companies_last_year': 0,
                    'funding_this_year': 0,
                    'growth_rate': 0
                },
                'top_industries': [],
                'geographic_distribution': []
            })


class CuratedContentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for curated content
    """
    queryset = CuratedContent.objects.all()
    serializer_class = CuratedContentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['content_type', 'featured']
    search_fields = ['title', 'description', 'content']
    ordering_fields = ['published_date', 'order', 'created_at']
    ordering = ['-featured', 'order', '-published_date']
    lookup_field = 'slug'
    
    def get_queryset(self):
        """Filter out non-accepted content for non-staff users"""
        queryset = CuratedContent.objects.all()
        if not self.request.user.is_staff:
            queryset = queryset.filter(moderation_status='accepted')
        return queryset
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured curated content"""
        featured_content = self.get_queryset().filter(featured=True)[:6]
        serializer = self.get_serializer(featured_content, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get curated content grouped by type"""
        content_types = dict(CuratedContent.content_type_choices)
        result = {}
        
        for type_key, type_name in content_types.items():
            content = self.get_queryset().filter(content_type=type_key)[:8]
            if content.exists():
                result[type_key] = {
                    'name': type_name,
                    'content': self.get_serializer(content, many=True).data
                }
        
        return Response(result)

class EcosystemBuilderRegistrationViewSet(viewsets.ModelViewSet):
    queryset = EcosystemBuilderRegistration.objects.all()
    serializer_class = EcosystemBuilderRegistrationSerializer
    http_method_names = ['post', 'get', 'head', 'options']

class HubViewSet(viewsets.ModelViewSet):
    queryset = Hub.objects.all()
    serializer_class = HubSerializer
    http_method_names = ['get', 'post', 'head', 'options']

class IncubatorViewSet(viewsets.ModelViewSet):
    queryset = Incubator.objects.all()
    serializer_class = IncubatorSerializer
    http_method_names = ['get', 'post', 'head', 'options']

class AcceleratorViewSet(viewsets.ModelViewSet):
    queryset = Accelerator.objects.all()
    serializer_class = AcceleratorSerializer
    http_method_names = ['get', 'post', 'head', 'options']

class UniversityViewSet(viewsets.ModelViewSet):
    serializer_class = UniversitySerializer
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        queryset = University.objects.all().order_by('name')
        # Only show accepted by default, unless admin or moderation_status param is set
        moderation_status = self.request.query_params.get('moderation_status', 'accepted')
        user = getattr(self.request, 'user', None)
        if moderation_status == 'all' and user and user.is_staff:
            return queryset
        return queryset.filter(moderation_status=moderation_status)


class OrganizationRegistrationView(APIView):
    """
    API endpoint for organization registration
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Create a new organization registration"""
        print("=== ORGANIZATION REGISTRATION REQUEST ===")
        print("Request method:", request.method)
        print("Request headers:", dict(request.headers))
        print("Request data:", request.data)
        print("Request data type:", type(request.data))
        
        serializer = OrganizationRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                # Save the organization registration
                organization = serializer.save()
                
                # Auto-approve and create company
                try:
                    company = organization.create_company()
                    organization.status = 'approved'
                    organization.save()
                    
                    return Response({
                        'success': True,
                        'message': 'Organization registered and added to companies successfully!',
                        'organization_id': organization.id,
                        'organization_name': organization.organization_name,
                        'company_id': company.id,
                        'company_slug': company.slug,
                        'status': organization.status
                    }, status=status.HTTP_201_CREATED)
                    
                except Exception as company_error:
                    # If company creation fails, still keep the registration
                    print(f"Company creation failed: {company_error}")
                    return Response({
                        'success': True,
                        'message': 'Organization registration submitted successfully! (Manual approval required)',
                        'organization_id': organization.id,
                        'organization_name': organization.organization_name,
                        'status': organization.status,
                        'note': 'Company creation will be completed during manual review'
                    }, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                return Response({
                    'success': False,
                    'message': 'Failed to submit organization registration',
                    'error': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        print("Serializer errors:", serializer.errors)
        return Response({
            'success': False,
            'message': 'Invalid data provided',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        """Get organization registration statistics (for admin)"""
        if not request.user.is_staff:
            return Response({
                'error': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            total_registrations = OrganizationRegistration.objects.count()
            pending_registrations = OrganizationRegistration.objects.filter(status='pending').count()
            approved_registrations = OrganizationRegistration.objects.filter(status='approved').count()
            
            # Get registrations by organization type
            type_stats = OrganizationRegistration.objects.values('organization_type').annotate(
                count=Count('id')
            ).order_by('-count')
            
            # Recent registrations
            recent_registrations = OrganizationRegistration.objects.order_by('-created_at')[:10]
            recent_data = OrganizationRegistrationSerializer(recent_registrations, many=True).data
            
            return Response({
                'total_registrations': total_registrations,
                'pending_registrations': pending_registrations,
                'approved_registrations': approved_registrations,
                'type_statistics': list(type_stats),
                'recent_registrations': recent_data
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OrganizationRegistrationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing organization registrations (admin only)
    """
    queryset = OrganizationRegistration.objects.all()
    serializer_class = OrganizationRegistrationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'organization_type', 'country']
    search_fields = ['organization_name', 'first_name', 'last_name', 'email']
    ordering_fields = ['created_at', 'organization_name', 'status']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """
        Only allow staff users to access this viewset
        """
        if self.action in ['list', 'retrieve', 'update', 'partial_update']:
            permission_classes = [AllowAny]  # Change to IsAdminUser in production
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve an organization registration and create Company"""
        registration = self.get_object()
        
        try:
            # Create Company from registration
            company = registration.create_company()
            
            # Update registration status
            registration.status = 'approved'
            registration.reviewed_at = timezone.now()
            registration.reviewed_by = request.user.username if request.user.is_authenticated else 'system'
            registration.save()
            
            return Response({
                'success': True,
                'message': f'Organization "{registration.organization_name}" has been approved and added to companies',
                'company_id': company.id,
                'company_slug': company.slug
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error approving organization: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject an organization registration"""
        registration = self.get_object()
        registration.status = 'rejected'
        registration.reviewed_at = timezone.now()
        registration.reviewed_by = request.user.username if request.user.is_authenticated else 'system'
        registration.admin_notes = request.data.get('reason', '')
        registration.save()
        
        # TODO: Send rejection email
        # send_organization_rejection_email(registration)
        
        return Response({
            'success': True,
            'message': f'Organization "{registration.organization_name}" has been rejected'
        })
    
    @action(detail=True, methods=['post'])
    def request_info(self, request, pk=None):
        """Request more information from organization"""
        registration = self.get_object()
        registration.status = 'needs_info'
        registration.reviewed_at = timezone.now()
        registration.reviewed_by = request.user.username if request.user.is_authenticated else 'system'
        registration.admin_notes = request.data.get('message', '')
        registration.save()
        
        # TODO: Send request for more info email
        # send_organization_info_request_email(registration)
        
        return Response({
            'success': True,
            'message': f'Requested more information from "{registration.organization_name}"'
        })


class ContactView(APIView):
    """Handle contact form submissions"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Create a new contact submission"""
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            contact = serializer.save()
            
            # TODO: Send notification email to admin
            # TODO: Send confirmation email to user
            
            return Response({
                'success': True,
                'message': 'Thank you for your message! We will get back to you soon.',
                'contact_id': contact.id
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Please check your form data and try again.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ContactViewSet(viewsets.ModelViewSet):
    """Admin viewset for managing contact submissions"""
    queryset = Contact.objects.all()
    serializer_class = ContactAdminSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['name', 'email', 'company', 'message']
    ordering_fields = ['created_at', 'updated_at', 'status']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'create':
            return ContactSerializer
        return ContactAdminSerializer
    
    @action(detail=True, methods=['post'])
    def mark_resolved(self, request, pk=None):
        """Mark contact as resolved"""
        contact = self.get_object()
        contact.status = 'resolved'
        contact.responded_at = timezone.now()
        if request.user.is_authenticated:
            contact.responded_by = request.user
        contact.save()
        
        return Response({
            'success': True,
            'message': f'Contact from {contact.name} marked as resolved'
        })
    
    @action(detail=True, methods=['post'])
    def add_notes(self, request, pk=None):
        """Add admin notes to contact"""
        contact = self.get_object()
        notes = request.data.get('notes', '')
        if notes:
            contact.admin_notes = notes
            contact.save()
            return Response({
                'success': True,
                'message': 'Notes added successfully'
            })
        
        return Response({
            'success': False,
            'message': 'Notes cannot be empty'
        }, status=status.HTTP_400_BAD_REQUEST)