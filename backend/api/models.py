from django.db import models
from django.utils.text import slugify
from django.conf import settings
from datetime import date

MODERATION_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('accepted', 'Accepted'),
    ('rejected', 'Rejected'),
]

class CuratedContent(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    content_type_choices = [
        ('article', 'Article'),
        ('report', 'Report'),
        ('guide', 'Guide'),
        ('resource', 'Resource'),
        ('news', 'News'),
        ('other', 'Other'),
    ]
    content_type = models.CharField(max_length=50, choices=content_type_choices, default='article')
    image = models.ImageField(upload_to='curated_content/', blank=True, null=True)
    external_url = models.URLField(blank=True, null=True)
    file = models.FileField(upload_to='curated_content_files/', blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    published_date = models.DateField(auto_now_add=True)
    moderation_status = models.CharField(
        max_length=20,
        choices=MODERATION_STATUS_CHOICES,
        default='pending',
        help_text="Admin moderation status. Only 'accepted' are public."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Relationships
    industries = models.ManyToManyField('Industry', blank=True, related_name='curated_content')
    related_companies = models.ManyToManyField('Company', blank=True, related_name='curated_content')
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            original_slug = self.slug
            counter = 1
            while CuratedContent.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "Curated Content"
        ordering = ['-featured', 'order', '-published_date']

class Industry(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    parent_industry = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='child_industries'
    )
    moderation_status = models.CharField(
        max_length=20,
        choices=MODERATION_STATUS_CHOICES,
        default='pending',
        help_text="Admin moderation status. Only 'accepted' are public."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            original_slug = self.slug
            counter = 1
            while Industry.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Industries"
        ordering = ['name']

class Person(models.Model):
    full_name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    email = models.EmailField(blank=True, null=True, unique=True)
    linkedin_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='person_profiles/', blank=True, null=True)
    moderation_status = models.CharField(
        max_length=20,
        choices=MODERATION_STATUS_CHOICES,
        default='pending',
        help_text="Admin moderation status. Only 'accepted' are public."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.full_name)
            original_slug = self.slug
            counter = 1
            while Person.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name_plural = "People"
        ordering = ['full_name']

class Investor(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    logo = models.ImageField(upload_to='investor_logos/', blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    investor_type_choices = [
        ('VC', 'Venture Capital'),
        ('Angel', 'Angel Investor'),
        ('PE', 'Private Equity'),
        ('Corporate', 'Corporate Venture Arm'),
        ('Accelerator', 'Accelerator/Incubator'),
        ('Government', 'Government Fund'),
        ('FamilyOffice', 'Family Office'),
        ('Other', 'Other'),
    ]
    investor_type = models.CharField(max_length=50, choices=investor_type_choices, blank=True, null=True)
    hq_city = models.CharField(max_length=100, blank=True, null=True)
    hq_country = models.CharField(max_length=100, blank=True, null=True, default="Ethiopia")
    funding_stages_focus = models.CharField(
        max_length=255, 
        blank=True, 
        null=True, 
        help_text="Comma-separated list of stages, e.g., Seed, Series A, Growth"
    )
    contact_email = models.EmailField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    moderation_status = models.CharField(
        max_length=20,
        choices=MODERATION_STATUS_CHOICES,
        default='pending',
        help_text="Admin moderation status. Only 'accepted' are public."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    industries_focus = models.ManyToManyField(Industry, blank=True, related_name='focused_investors')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            original_slug = self.slug
            counter = 1
            while Investor.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Investors"
        ordering = ['name']

class Company(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(
        max_length=255, 
        unique=True, 
        blank=True, 
        help_text="Unique URL-friendly identifier. Leave blank to auto-generate from name."
    )
    short_description = models.CharField(
        max_length=500, 
        blank=True, 
        null=True, 
        help_text="A brief tagline or summary."
    )
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    logo = models.ImageField(
        upload_to='company_logos/', 
        blank=True, 
        null=True, 
        help_text="Company logo image file."
    )
    hq_city = models.CharField(max_length=100, blank=True, null=True)
    hq_country = models.CharField(max_length=100, blank=True, null=True, default="Ethiopia")
    contact_email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=30, blank=True, null=True)
    founded_date = models.DateField(blank=True, null=True)
    
    company_type_choices = [
        ('Startup', 'Startup'),
        ('SME', 'Small & Medium Enterprise'),
        ('Corporation', 'Corporation'),
        ('Non-profit', 'Non-profit'),
        ('Government', 'Government'),
    ]
    company_type = models.CharField(max_length=50, choices=company_type_choices, blank=True, null=True)
    
    status_choices = [
        ('Operating', 'Operating'),
        ('Stealth', 'Stealth Mode'),
        ('Pre-launch', 'Pre-launch'),
        ('Acquired', 'Acquired'),
        ('Closed', 'Closed'),
    ]
    status = models.CharField(max_length=50, choices=status_choices, blank=True, null=True)
    
    employee_count_range_choices = [
        ('1-10', '1-10 employees'),
        ('11-50', '11-50 employees'),
        ('51-200', '51-200 employees'),
        ('201-500', '201-500 employees'),
        ('501-1000', '501-1000 employees'),
        ('1001-5000', '1001-5000 employees'),
        ('5000+', '5000+ employees'),
    ]
    employee_count_range = models.CharField(
        max_length=50, 
        choices=employee_count_range_choices, 
        blank=True, 
        null=True
    )
    
    total_funding_raised_usd = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        blank=True, 
        null=True, 
        help_text="In USD"
    )
    last_funding_date = models.DateField(blank=True, null=True)
    last_funding_stage = models.CharField(
        max_length=50, 
        blank=True, 
        null=True, 
        help_text="e.g., Seed, Series A, Grant, IPO"
    )
    
    # Social media links
    linkedin_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    facebook_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    crunchbase_url = models.URLField(blank=True, null=True)
    angellist_url = models.URLField(blank=True, null=True)
    
    moderation_status = models.CharField(
        max_length=20,
        choices=MODERATION_STATUS_CHOICES,
        default='pending',
        help_text="Admin moderation status. Only 'accepted' are public."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Relationships
    industries = models.ManyToManyField(Industry, blank=True, related_name='companies')
    founders = models.ManyToManyField(
        Person, 
        blank=True, 
        related_name='founded_companies', 
        help_text="People who founded this company."
    )
    key_people = models.ManyToManyField(
        Person, 
        blank=True, 
        related_name='current_companies', 
        help_text="Current key personnel."
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            original_slug = self.slug
            counter = 1
            while Company.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Companies"
        ordering = ['name']

class FundingRound(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='funding_rounds')
    round_type_choices = [
        ('Seed', 'Seed'),
        ('Pre-Seed', 'Pre-Seed'),
        ('Series A', 'Series A'),
        ('Series B', 'Series B'),
        ('Series C', 'Series C'),
        ('Series D+', 'Series D+'),
        ('Grant', 'Grant'),
        ('Debt', 'Debt Financing'),
        ('Equity Crowdfunding', 'Equity Crowdfunding'),
        ('ICO', 'Initial Coin Offering'),
        ('IPO', 'Initial Public Offering'),
        ('Angel', 'Angel Round'),
        ('Venture', 'Venture Round - Unspecified Series'),
        ('Undisclosed', 'Undisclosed'),
        ('Other', 'Other'),
    ]
    round_type = models.CharField(max_length=50, choices=round_type_choices)
    announced_date = models.DateField()
    money_raised_usd = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    pre_money_valuation_usd = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    post_money_valuation_usd = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    source_url = models.URLField(
        blank=True, 
        null=True, 
        help_text="URL of the announcement or source"
    )
    notes = models.TextField(blank=True, null=True)
    investors = models.ManyToManyField(
        Investor, 
        through='FundingRoundParticipation', 
        related_name='investments_made'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company.name} - {self.get_round_type_display()} ({self.announced_date})"

    class Meta:
        ordering = ['-announced_date', 'company__name']

class FundingRoundParticipation(models.Model):
    funding_round = models.ForeignKey(FundingRound, on_delete=models.CASCADE)
    investor = models.ForeignKey(Investor, on_delete=models.CASCADE)
    is_lead_investor = models.BooleanField(default=False)
    amount_invested_usd = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        blank=True, 
        null=True, 
        help_text="If known for this specific investor in this round"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.investor.name} in {self.funding_round.company.name}'s {self.funding_round.get_round_type_display()} round"

    class Meta:
        unique_together = ('funding_round', 'investor')
        ordering = ['funding_round__announced_date', 'investor__name']

class EcosystemBuilderRegistration(models.Model):
    ORG_TYPE_CHOICES = [
        ('Innovation hub or incubator', 'Innovation hub or incubator'),
        ('University or TVET', 'University or TVET'),
        ('Government body', 'Government body'),
        ('NGO / CSO', 'NGO / CSO'),
        ('Private company', 'Private company'),
        ('Investor', 'Investor'),
        ('Donor or international agency', 'Donor or international agency'),
        ('Other', 'Other'),
    ]
    SUPPORT_SERVICE_CHOICES = [
        ('Training or capacity building', 'Training or capacity building'),
        ('Mentorship or coaching', 'Mentorship or coaching'),
        ('Infrastructure (co-working, lab, etc.)', 'Infrastructure (co-working, lab, etc.)'),
        ('Seed or grant funding', 'Seed or grant funding'),
        ('Research and innovation services', 'Research and innovation services'),
        ('Incubator', 'Incubator'),
        ('Other', 'Other'),
    ]
    org_name = models.CharField(max_length=255)
    full_name_and_position = models.CharField(max_length=255)
    org_type = models.CharField(max_length=64, choices=ORG_TYPE_CHOICES)
    support_services = models.JSONField(default=list)
    operating_duration = models.CharField(max_length=100)
    notable_programs = models.TextField()
    collaboration = models.TextField()
    region = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    mobile = models.CharField(max_length=30, blank=True, null=True)
    email = models.EmailField()
    website = models.URLField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    moderation_status = models.CharField(max_length=20, choices=MODERATION_STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.org_name} ({self.org_type})"

    class Meta:
        verbose_name = "Ecosystem Builder Registration"
        verbose_name_plural = "Ecosystem Builder Registrations"
        ordering = ['-submitted_at']

class Hub(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=30, blank=True, null=True)
    logo_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    moderation_status = models.CharField(max_length=20, choices=MODERATION_STATUS_CHOICES, default='pending')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class Incubator(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=30, blank=True, null=True)
    logo_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    moderation_status = models.CharField(max_length=20, choices=MODERATION_STATUS_CHOICES, default='pending')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class Accelerator(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=30, blank=True, null=True)
    logo_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    moderation_status = models.CharField(max_length=20, choices=MODERATION_STATUS_CHOICES, default='pending')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class University(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=30, blank=True, null=True)
    logo_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    moderation_status = models.CharField(max_length=20, choices=MODERATION_STATUS_CHOICES, default='pending')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
class OrganizationRegistration(models.Model):
    ORGANIZATION_TYPES = [
        ('startup', 'Startup'),
        ('scaleup', 'Scaleup'),
        ('vc', 'Venture Capital'),
        ('angel', 'Angel Investor'),
        ('accelerator', 'Accelerator'),
        ('incubator', 'Incubator'),
        ('hub', 'Innovation Hub'),
        ('university', 'University'),
        ('government', 'Government Body'),
        ('corporate', 'Corporate'),
        ('ngo', 'NGO/Non-Profit'),
        ('service_provider', 'Service Provider'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('needs_info', 'Needs More Information'),
    ]
    
    FUNDING_STAGES = [
        ('pre_seed', 'Pre-seed'),
        ('seed', 'Seed'),
        ('series_a', 'Series A'),
        ('series_b', 'Series B'),
        ('series_c_plus', 'Series C+'),
        ('growth', 'Growth'),
        ('ipo', 'IPO'),
        ('not_applicable', 'Not applicable'),
    ]
    
    # Organization Details
    organization_type = models.CharField(max_length=20, choices=ORGANIZATION_TYPES)
    organization_name = models.CharField(max_length=200)
    website = models.URLField(blank=True, null=True)
    description = models.TextField()
    founded_year = models.IntegerField(blank=True, null=True)
    employee_count = models.CharField(max_length=20, blank=True, null=True)
    headquarters = models.CharField(max_length=100)
    country = models.CharField(max_length=50, default='Ethiopia')
    
    # Contact Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    position = models.CharField(max_length=100)
    linkedin_profile = models.URLField(blank=True, null=True)
    
    # Additional Information
    sectors = models.JSONField(default=list, blank=True)  # Store as JSON array
    funding_stage = models.CharField(max_length=20, choices=FUNDING_STAGES, blank=True, null=True)
    total_funding = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    key_achievements = models.TextField(blank=True, null=True)
    
    # Account & Preferences
    subscribe_newsletter = models.BooleanField(default=True)
    
    # Status & Metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    reviewed_by = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f"{self.organization_name} ({self.get_organization_type_display()})"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def create_company(self):
        """
        Create a Company instance from this registration
        Returns the created Company instance
        """
        # Map organization types
        org_type_mapping = {
            'startup': 'Startup',
            'scaleup': 'Startup',  # Treat scaleup as startup
            'vc': 'Corporation',
            'angel': 'Corporation',
            'accelerator': 'Corporation',
            'incubator': 'Corporation',
            'hub': 'Corporation',
            'university': 'Corporation',
            'government': 'Government',
            'corporate': 'Corporation',
            'ngo': 'Non-profit',
            'service_provider': 'Corporation',
        }
        
        # Map funding stages to more standard format
        funding_stage_mapping = {
            'pre_seed': 'Pre-seed',
            'seed': 'Seed',
            'series_a': 'Series A',
            'series_b': 'Series B',
            'series_c_plus': 'Series C+',
            'growth': 'Growth',
            'ipo': 'IPO',
            'not_applicable': None,
        }
        
        # Check if company already exists
        existing_company = Company.objects.filter(name=self.organization_name).first()
        if existing_company:
            return existing_company
        
        # Create the company
        company = Company.objects.create(
            name=self.organization_name,
            description=self.description,
            website=self.website,
            hq_city=self.headquarters,
            hq_country=self.country,
            contact_email=self.email,
            phone_number=self.phone,
            founded_date=date(self.founded_year, 1, 1) if self.founded_year else None,
            company_type=org_type_mapping.get(self.organization_type, 'Startup'),
            status='Operating',  # Default status
            employee_count_range=self.employee_count,
            total_funding_raised_usd=self.total_funding,
            last_funding_stage=funding_stage_mapping.get(self.funding_stage),
            linkedin_url=self.linkedin_profile,
            moderation_status='accepted'  # Auto-approve since it was manually approved
        )
        
        # Add industries/sectors if any
        if self.sectors:
            for sector_name in self.sectors:
                # Try to find or create industry
                industry, created = Industry.objects.get_or_create(
                    name=sector_name,
                    defaults={'description': f'{sector_name} industry'}
                )
                company.industries.add(industry)
        
        # Create founder person if not exists
        founder, created = Person.objects.get_or_create(
            email=self.email,
            defaults={
                'full_name': self.get_full_name(),
                'linkedin_url': self.linkedin_profile,
                'bio': f"{self.position} at {self.organization_name}",
                'moderation_status': 'accepted'
            }
        )
        
        # Add founder to company
        company.founders.add(founder)
        company.key_people.add(founder)
        
        return company
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Organization Registration"
        verbose_name_plural = "Organization Registrations"


class Contact(models.Model):
    """Model to store contact form submissions"""
    name = models.CharField(max_length=255, help_text="Full name of the person contacting")
    email = models.EmailField(help_text="Email address for response")
    company = models.CharField(max_length=255, blank=True, null=True, help_text="Company name (optional)")
    message = models.TextField(help_text="Contact message")
    
    # Status tracking
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    
    # Admin notes
    admin_notes = models.TextField(blank=True, null=True, help_text="Internal notes for admin use")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Response tracking
    responded_at = models.DateTimeField(blank=True, null=True)
    responded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        blank=True, 
        null=True,
        help_text="Admin user who responded"
    )
    
    def __str__(self):
        return f"Contact from {self.name} ({self.email}) - {self.status}"
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Contact Submission"
        verbose_name_plural = "Contact Submissions"
