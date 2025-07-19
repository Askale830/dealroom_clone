from django.contrib import admin
from django.utils import timezone
from .models import Company, Industry, Person, Investor, FundingRound, FundingRoundParticipation, CuratedContent, EcosystemBuilderRegistration, Hub, Incubator, Accelerator, University, Contact

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'moderation_status', 'hq_country', 'founded_date', 'total_funding_raised_usd')
    list_filter = ('status', 'moderation_status', 'company_type', 'hq_country', 'industries')
    search_fields = ('name', 'description', 'short_description')
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('industries', 'founders', 'key_people')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'short_description', 'description', 'logo')
        }),
        ('Contact & Location', {
            'fields': ('website', 'contact_email', 'phone_number', 'hq_city', 'hq_country')
        }),
        ('Company Details', {
            'fields': ('founded_date', 'company_type', 'status', 'employee_count_range', 'moderation_status')
        }),
        ('Funding Information', {
            'fields': ('total_funding_raised_usd', 'last_funding_date', 'last_funding_stage')
        }),
        ('Social Media', {
            'fields': ('linkedin_url', 'twitter_url', 'facebook_url', 'instagram_url', 'crunchbase_url', 'angellist_url'),
            'classes': ('collapse',)
        }),
        ('Relationships', {
            'fields': ('industries', 'founders', 'key_people')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(Industry)
class IndustryAdmin(admin.ModelAdmin):
    list_display = ('name', 'moderation_status', 'parent_industry', 'created_at')
    list_filter = ('moderation_status', 'parent_industry')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'moderation_status', 'created_at')
    list_filter = ('moderation_status',)
    search_fields = ('full_name', 'email', 'bio')
    prepopulated_fields = {'slug': ('full_name',)}
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('full_name', 'slug', 'email', 'bio', 'profile_picture')
        }),
        ('Social Media', {
            'fields': ('linkedin_url', 'twitter_url')
        }),
        ('Moderation', {
            'fields': ('moderation_status',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(Investor)
class InvestorAdmin(admin.ModelAdmin):
    list_display = ('name', 'investor_type', 'moderation_status', 'hq_country', 'created_at')
    list_filter = ('investor_type', 'moderation_status', 'hq_country', 'industries_focus')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('industries_focus',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'logo', 'investor_type')
        }),
        ('Contact & Location', {
            'fields': ('website', 'contact_email', 'hq_city', 'hq_country')
        }),
        ('Investment Focus', {
            'fields': ('funding_stages_focus', 'industries_focus')
        }),
        ('Social Media', {
            'fields': ('linkedin_url',)
        }),
        ('Moderation', {
            'fields': ('moderation_status',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

class FundingRoundParticipationInline(admin.TabularInline):
    model = FundingRoundParticipation
    extra = 1
    autocomplete_fields = ('investor',)

@admin.register(FundingRound)
class FundingRoundAdmin(admin.ModelAdmin):
    list_display = ('company', 'round_type', 'announced_date', 'money_raised_usd')
    list_filter = ('round_type', 'announced_date')
    search_fields = ('company__name', 'notes')
    autocomplete_fields = ('company',)
    inlines = [FundingRoundParticipationInline]
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('company', 'round_type', 'announced_date')
        }),
        ('Financial Details', {
            'fields': ('money_raised_usd', 'pre_money_valuation_usd', 'post_money_valuation_usd')
        }),
        ('Additional Information', {
            'fields': ('source_url', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(FundingRoundParticipation)
class FundingRoundParticipationAdmin(admin.ModelAdmin):
    list_display = ('investor', 'funding_round', 'is_lead_investor', 'amount_invested_usd')
    list_filter = ('is_lead_investor', 'funding_round__round_type')
    search_fields = ('investor__name', 'funding_round__company__name')
    autocomplete_fields = ('investor', 'funding_round')

@admin.register(CuratedContent)
class CuratedContentAdmin(admin.ModelAdmin):
    list_display = ('title', 'content_type', 'featured', 'moderation_status', 'published_date')
    list_filter = ('content_type', 'featured', 'moderation_status', 'published_date')
    search_fields = ('title', 'description', 'content')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('industries', 'related_companies')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'content_type', 'image')
        }),
        ('Content', {
            'fields': ('content', 'external_url', 'file')
        }),
        ('Display Options', {
            'fields': ('featured', 'order')
        }),
        ('Relationships', {
            'fields': ('industries', 'related_companies')
        }),
        ('Moderation', {
            'fields': ('moderation_status', 'published_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

admin.site.register(EcosystemBuilderRegistration)
admin.site.register(Hub)
admin.site.register(Incubator)
admin.site.register(Accelerator)
admin.site.register(University)

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'company', 'status', 'created_at', 'responded_at')
    list_filter = ('status', 'created_at', 'responded_at')
    search_fields = ('name', 'email', 'company', 'message')
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('status',)
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'company', 'message')
        }),
        ('Status & Response', {
            'fields': ('status', 'admin_notes', 'responded_at', 'responded_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if change and obj.status in ['resolved', 'closed'] and not obj.responded_by:
            obj.responded_by = request.user
            if not obj.responded_at:
                obj.responded_at = timezone.now()
        super().save_model(request, obj, form, change)

# Customize admin site
admin.site.site_header = "Dealroom Ethiopia Admin"
admin.site.site_title = "Dealroom Ethiopia"
admin.site.index_title = "Welcome to Dealroom Ethiopia Administration"