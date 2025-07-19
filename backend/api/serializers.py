from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Company, Industry, Person, Investor, FundingRound, FundingRoundParticipation, CuratedContent, EcosystemBuilderRegistration, Hub, Incubator, Accelerator, University, OrganizationRegistration, Contact

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password')
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        return token

class IndustrySerializer(serializers.ModelSerializer):
    company_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Industry
        fields = '__all__'
    
    def get_company_count(self, obj):
        return obj.companies.filter(moderation_status='accepted').count()

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class CompanyListSerializer(serializers.ModelSerializer):
    industries = IndustrySerializer(many=True, read_only=True)
    total_funding_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'slug', 'short_description', 'logo',
            'status', 'company_type', 'hq_country', 'hq_city',
            'founded_date', 'total_funding_raised_usd', 'total_funding_display',
            'employee_count_range', 'industries', 'created_at'
        ]
    
    def get_total_funding_display(self, obj):
        if obj.total_funding_raised_usd:
            amount = float(obj.total_funding_raised_usd)
            if amount >= 1_000_000_000:
                return f"${amount/1_000_000_000:.1f}B"
            elif amount >= 1_000_000:
                return f"${amount/1_000_000:.1f}M"
            elif amount >= 1_000:
                return f"${amount/1_000:.1f}K"
            else:
                return f"${amount:.0f}"
        return "N/A"

class CompanySerializer(serializers.ModelSerializer):
    industries = IndustrySerializer(many=True, read_only=True)
    industry_ids = serializers.PrimaryKeyRelatedField(
        queryset=Industry.objects.all(),
        many=True,
        write_only=True,
        source='industries'
    )
    founders = PersonSerializer(many=True, read_only=True)
    key_people = PersonSerializer(many=True, read_only=True)
    funding_rounds = serializers.SerializerMethodField()
    total_funding_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = '__all__'
    
    def get_funding_rounds(self, obj):
        rounds = obj.funding_rounds.all().order_by('-announced_date')[:5]
        return FundingRoundSerializer(rounds, many=True).data
    
    def get_total_funding_display(self, obj):
        if obj.total_funding_raised_usd:
            amount = float(obj.total_funding_raised_usd)
            if amount >= 1_000_000_000:
                return f"${amount/1_000_000_000:.1f}B"
            elif amount >= 1_000_000:
                return f"${amount/1_000_000:.1f}M"
            elif amount >= 1_000:
                return f"${amount/1_000:.1f}K"
            else:
                return f"${amount:.0f}"
        return "N/A"

class InvestorSerializer(serializers.ModelSerializer):
    industries_focus = IndustrySerializer(many=True, read_only=True)
    portfolio_count = serializers.SerializerMethodField()
    total_investments = serializers.SerializerMethodField()
    
    class Meta:
        model = Investor
        fields = '__all__'
    
    def get_portfolio_count(self, obj):
        return FundingRoundParticipation.objects.filter(
            investor=obj,
            funding_round__company__moderation_status='accepted'
        ).values('funding_round__company').distinct().count()
    
    def get_total_investments(self, obj):
        return FundingRoundParticipation.objects.filter(investor=obj).count()

class FundingRoundParticipationSerializer(serializers.ModelSerializer):
    investor = InvestorSerializer(read_only=True)
    
    class Meta:
        model = FundingRoundParticipation
        fields = '__all__'

class FundingRoundSerializer(serializers.ModelSerializer):
    company = CompanyListSerializer(read_only=True)
    investors = serializers.SerializerMethodField()
    money_raised_display = serializers.SerializerMethodField()
    
    class Meta:
        model = FundingRound
        fields = '__all__'
    
    def get_investors(self, obj):
        participations = obj.fundingroundparticipation_set.all()
        return FundingRoundParticipationSerializer(participations, many=True).data
    
    def get_money_raised_display(self, obj):
        if obj.money_raised_usd:
            amount = float(obj.money_raised_usd)
            if amount >= 1_000_000_000:
                return f"${amount/1_000_000_000:.1f}B"
            elif amount >= 1_000_000:
                return f"${amount/1_000_000:.1f}M"
            elif amount >= 1_000:
                return f"${amount/1_000:.1f}K"
            else:
                return f"${amount:.0f}"
        return "N/A"


class CuratedContentSerializer(serializers.ModelSerializer):
    industries = IndustrySerializer(many=True, read_only=True)
    related_companies = CompanyListSerializer(many=True, read_only=True)
    industry_ids = serializers.PrimaryKeyRelatedField(
        queryset=Industry.objects.all(),
        many=True,
        write_only=True,
        source='industries',
        required=False
    )
    related_company_ids = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(),
        many=True,
        write_only=True,
        source='related_companies',
        required=False
    )
    content_type_display = serializers.SerializerMethodField()
    
    class Meta:
        model = CuratedContent
        fields = '__all__'
    
    def get_content_type_display(self, obj):
        return obj.get_content_type_display()

class EcosystemBuilderRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EcosystemBuilderRegistration
        fields = '__all__'

class HubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = '__all__'

class IncubatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incubator
        fields = '__all__'

class AcceleratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accelerator
        fields = '__all__'

class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = '__all__'


class OrganizationRegistrationSerializer(serializers.ModelSerializer):
    organization_type_display = serializers.SerializerMethodField()
    funding_stage_display = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    
    class Meta:
        model = OrganizationRegistration
        fields = '__all__'
        read_only_fields = ('status', 'admin_notes', 'reviewed_at', 'reviewed_by')
    
    def get_organization_type_display(self, obj):
        return obj.get_organization_type_display()
    
    def get_funding_stage_display(self, obj):
        return obj.get_funding_stage_display() if obj.funding_stage else None
    
    def get_status_display(self, obj):
        return obj.get_status_display()
    
    def validate_email(self, value):
        """Check if email is already registered"""
        queryset = OrganizationRegistration.objects.filter(email=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("An organization with this email is already registered.")
        return value
    
    def validate_organization_name(self, value):
        """Check if organization name is already registered"""
        queryset = OrganizationRegistration.objects.filter(organization_name__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("An organization with this name is already registered.")
        return value


class ContactSerializer(serializers.ModelSerializer):
    """Serializer for contact form submissions"""
    
    class Meta:
        model = Contact
        fields = [
            'id', 'name', 'email', 'company', 'message', 
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']
    
    def validate_email(self, value):
        """Validate email format"""
        if not value:
            raise serializers.ValidationError("Email is required.")
        return value.lower()
    
    def validate_name(self, value):
        """Validate name field"""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return value.strip()
    
    def validate_message(self, value):
        """Validate message field"""
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters long.")
        return value.strip()


class ContactAdminSerializer(serializers.ModelSerializer):
    """Admin serializer for contact submissions with all fields"""
    responded_by_name = serializers.CharField(source='responded_by.username', read_only=True)
    
    class Meta:
        model = Contact
        fields = [
            'id', 'name', 'email', 'company', 'message', 'status', 
            'admin_notes', 'created_at', 'updated_at', 'responded_at', 
            'responded_by', 'responded_by_name'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'responded_by_name']