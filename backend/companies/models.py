from django.db import models
from django.contrib.auth.models import User
from django.core.validators import URLValidator, EmailValidator
from django.utils import timezone

class Industry(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Industries"
        ordering = ['name']

    def __str__(self):
        return self.name

class Company(models.Model):
    COMPANY_TYPE_CHOICES = [
        ('Startup', 'Startup'),
        ('SME', 'Small & Medium Enterprise'),
        ('Corporation', 'Corporation'),
        ('Non-profit', 'Non-profit'),
        ('Government', 'Government'),
    ]

    STATUS_CHOICES = [
        ('Operating', 'Operating'),
        ('Stealth', 'Stealth Mode'),
        ('Pre-launch', 'Pre-launch'),
        ('Acquired', 'Acquired'),
        ('Closed', 'Closed'),
    ]

    MODERATION_STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('needs_revision', 'Needs Revision'),
    ]

    EMPLOYEE_COUNT_CHOICES = [
        ('1', '1'),
        ('2-10', '2-10'),
        ('11-50', '11-50'),
        ('51-200', '51-200'),
        ('201-500', '201-500'),
        ('501-1000', '501-1000'),
        ('1000+', '1000+'),
    ]

    # Basic Information
    name = models.CharField(max_length=255)
    short_description = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True, validators=[URLValidator()])
    founded_date = models.DateField(blank=True, null=True)
    company_type = models.CharField(max_length=50, choices=COMPANY_TYPE_CHOICES, blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Operating')
    
    # Location
    hq_country = models.CharField(max_length=100)
    hq_city = models.CharField(max_length=100)
    hq_address = models.TextField(blank=True, null=True)
    
    # Company Details
    employee_count = models.CharField(max_length=20, choices=EMPLOYEE_COUNT_CHOICES, blank=True, null=True)
    total_funding_raised_usd = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    
    # Contact Information
    contact_email = models.EmailField(validators=[EmailValidator()])
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Social Media & Links
    linkedin_url = models.URLField(blank=True, null=True, validators=[URLValidator()])
    twitter_url = models.URLField(blank=True, null=True, validators=[URLValidator()])
    facebook_url = models.URLField(blank=True, null=True, validators=[URLValidator()])
    logo_url = models.URLField(blank=True, null=True, validators=[URLValidator()])
    
    # Additional Information
    industries = models.ManyToManyField(Industry, blank=True)
    tags = models.TextField(blank=True, null=True, help_text="Comma-separated tags")
    notes = models.TextField(blank=True, null=True)
    
    # Moderation & Metadata
    moderation_status = models.CharField(max_length=20, choices=MODERATION_STATUS_CHOICES, default='pending')
    submission_type = models.CharField(max_length=50, default='company_registration')
    submitted_at = models.DateTimeField(default=timezone.now)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='reviewed_companies')
    rejection_reason = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # SEO & Display
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    is_featured = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['moderation_status']),
            models.Index(fields=['company_type']),
            models.Index(fields=['hq_country']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            import uuid
            self.slug = slugify(self.name) + '-' + str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)

    @property
    def tag_list(self):
        """Return tags as a list"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',') if tag.strip()]
        return []

class PageContent(models.Model):
    """Dynamic content for pages"""
    page_key = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    benefits = models.JSONField(default=list, help_text="List of benefits")
    requirements = models.JSONField(default=list, help_text="List of requirements")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.page_key} - {self.title}"