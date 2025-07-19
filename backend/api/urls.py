from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .views import EcosystemBuilderRegistrationViewSet, HubViewSet, IncubatorViewSet, AcceleratorViewSet, UniversityViewSet, OrganizationRegistrationViewSet, ContactViewSet

router = DefaultRouter()
router.register(r'companies', views.CompanyViewSet, basename='company')
router.register(r'industries', views.IndustryViewSet, basename='industry')
router.register(r'people', views.PersonViewSet, basename='person')
router.register(r'investors', views.InvestorViewSet, basename='investor')
router.register(r'funding-rounds', views.FundingRoundViewSet, basename='funding-round')
router.register(r'curated-content', views.CuratedContentViewSet, basename='curated-content')
router.register(r'ecosystem-builder-registrations', EcosystemBuilderRegistrationViewSet, basename='ecosystembuilderregistration')
router.register(r'hubs', HubViewSet, basename='hub')
router.register(r'incubators', IncubatorViewSet, basename='incubator')
router.register(r'accelerators', AcceleratorViewSet, basename='accelerator')
router.register(r'universities', UniversityViewSet, basename='university')
router.register(r'organization-registrations', OrganizationRegistrationViewSet, basename='organization-registration')
router.register(r'contacts', ContactViewSet, basename='contact')

urlpatterns = [
    # Test endpoint
    path('test/', views.test_connection, name='test_connection'),
    
    # Authentication
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    
    # Dashboard
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    
    # Ecosystem
    path('ecosystem/', views.EcosystemView.as_view(), name='ecosystem'),
    
    # Organization Registration
    path('organization-signup/', views.OrganizationRegistrationView.as_view(), name='organization-signup'),
    
    # Contact Form
    path('contact/', views.ContactView.as_view(), name='contact'),
    
    # Include router URLs
    path('', include(router.urls)),
]