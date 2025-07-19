from django.core.management.base import BaseCommand
from companies.models import (
    Industry, CompanyType, CompanyStatus, EmployeeCountRange,
    PageContent, PageBenefit, PageRequirement, FormField
)

class Command(BaseCommand):
    help = 'Populate initial data for the companies app'

    def handle(self, *args, **options):
        self.stdout.write('Populating initial data...')

        # Create Industries
        industries_data = [
            {'name': 'Technology', 'description': 'Software, hardware, and tech services'},
            {'name': 'Healthcare', 'description': 'Medical devices, pharmaceuticals, health services'},
            {'name': 'Finance', 'description': 'Banking, insurance, fintech, investment'},
            {'name': 'E-commerce', 'description': 'Online retail, marketplaces, digital commerce'},
            {'name': 'Education', 'description': 'EdTech, online learning, educational services'},
            {'name': 'Entertainment', 'description': 'Media, gaming, content creation'},
            {'name': 'Manufacturing', 'description': 'Production, industrial, automotive'},
            {'name': 'Real Estate', 'description': 'Property, construction, PropTech'},
            {'name': 'Food & Beverage', 'description': 'Restaurants, food tech, agriculture'},
            {'name': 'Transportation', 'description': 'Logistics, mobility, shipping'},
            {'name': 'Energy', 'description': 'Renewable energy, oil & gas, utilities'},
            {'name': 'Other', 'description': 'Other industries not listed above'},
        ]

        for industry_data in industries_data:
            Industry.objects.get_or_create(
                name=industry_data['name'],
                defaults={'description': industry_data['description']}
            )

        # Create Company Types
        company_types = [
            {'name': 'Startup', 'description': 'Early-stage companies with high growth potential'},
            {'name': 'SME', 'description': 'Small & Medium Enterprises'},
            {'name': 'Corporation', 'description': 'Large established corporations'},
            {'name': 'Non-profit', 'description': 'Non-profit organizations'},
            {'name': 'Government', 'description': 'Government agencies and departments'},
        ]

        for i, company_type in enumerate(company_types):
            CompanyType.objects.get_or_create(
                name=company_type['name'],
                defaults={
                    'description': company_type['description'],
                    'display_order': i
                }
            )

        # Create Company Statuses
        statuses = [
            {'name': 'Operating', 'description': 'Actively operating', 'color_code': '#10b981'},
            {'name': 'Stealth', 'description': 'Operating in stealth mode', 'color_code': '#6b7280'},
            {'name': 'Pre-launch', 'description': 'Preparing for launch', 'color_code': '#f59e0b'},
            {'name': 'Acquired', 'description': 'Acquired by another company', 'color_code': '#3b82f6'},
            {'name': 'Closed', 'description': 'No longer operating', 'color_code': '#ef4444'},
        ]

        for i, status in enumerate(statuses):
            CompanyStatus.objects.get_or_create(
                name=status['name'],
                defaults={
                    'description': status['description'],
                    'color_code': status['color_code'],
                    'display_order': i
                }
            )

        # Create Employee Count Ranges
        employee_ranges = [
            {'range_label': '1', 'min_count': 1, 'max_count': 1},
            {'range_label': '2-10', 'min_count': 2, 'max_count': 10},
            {'range_label': '11-50', 'min_count': 11, 'max_count': 50},
            {'range_label': '51-200', 'min_count': 51, 'max_count': 200},
            {'range_label': '201-500', 'min_count': 201, 'max_count': 500},
            {'range_label': '501-1000', 'min_count': 501, 'max_count': 1000},
            {'range_label': '1000+', 'min_count': 1000, 'max_count': None},
        ]

        for i, emp_range in enumerate(employee_ranges):
            EmployeeCountRange.objects.get_or_create(
                range_label=emp_range['range_label'],
                defaults={
                    'min_count': emp_range['min_count'],
                    'max_count': emp_range['max_count'],
                    'display_order': i
                }
            )

        # Create Add Company Page Content
        add_company_page, created = PageContent.objects.get_or_create(
            page_key='add-company',
            defaults={
                'title': 'Register Your Company',
                'subtitle': 'Join our startup ecosystem and get discovered by investors, partners, and customers.',
                'description': 'Join our startup ecosystem and get discovered by investors, partners, and customers.',
                'meta_title': 'Register Your Company - Startup Ecosystem',
                'meta_description': 'Register your company in our startup ecosystem directory and connect with investors, partners, and customers.',
            }
        )

        if created:
            # Create Benefits for Add Company Page
            benefits_data = [
                {
                    'title': 'Increase your visibility to potential investors',
                    'description': 'Get discovered by angel investors, VCs, and funding organizations looking for promising startups.',
                    'icon': 'visibility',
                    'display_order': 1
                },
                {
                    'title': 'Connect with other startups and partners',
                    'description': 'Network with like-minded entrepreneurs and find potential business partners and collaborators.',
                    'icon': 'network',
                    'display_order': 2
                },
                {
                    'title': 'Access to ecosystem insights and reports',
                    'description': 'Get exclusive access to market insights, industry reports, and ecosystem analytics.',
                    'icon': 'analytics',
                    'display_order': 3
                },
                {
                    'title': 'Networking opportunities with industry leaders',
                    'description': 'Participate in exclusive events, workshops, and networking sessions with industry experts.',
                    'icon': 'events',
                    'display_order': 4
                }
            ]

            for benefit_data in benefits_data:
                PageBenefit.objects.create(
                    page_content=add_company_page,
                    **benefit_data
                )

            # Create Requirements for Add Company Page
            requirements_data = [
                {
                    'title': 'Company must be legally registered',
                    'description': 'Your company should be officially registered with the appropriate government authorities.',
                    'icon': 'legal',
                    'is_mandatory': True,
                    'display_order': 1
                },
                {
                    'title': 'Provide accurate and up-to-date information',
                    'description': 'All information provided must be current and accurate to maintain directory quality.',
                    'icon': 'accuracy',
                    'is_mandatory': True,
                    'display_order': 2
                },
                {
                    'title': 'Company should be actively operating or in development',
                    'description': 'We accept companies that are currently operating or in active development phase.',
                    'icon': 'active',
                    'is_mandatory': True,
                    'display_order': 3
                },
                {
                    'title': 'All information will be verified before approval',
                    'description': 'Our team will review and verify the information before your company appears in the directory.',
                    'icon': 'verification',
                    'is_mandatory': False,
                    'display_order': 4
                }
            ]

            for requirement_data in requirements_data:
                PageRequirement.objects.create(
                    page_content=add_company_page,
                    **requirement_data
                )

            # Create Form Fields for Add Company Page
            form_fields_data = [
                # Basic Information Section
                {
                    'field_name': 'name',
                    'field_label': 'Company Name',
                    'field_type': 'text',
                    'placeholder': 'Enter company name',
                    'is_required': True,
                    'section_name': 'Basic Information',
                    'display_order': 1
                },
                {
                    'field_name': 'website',
                    'field_label': 'Website',
                    'field_type': 'url',
                    'placeholder': 'https://www.example.com',
                    'is_required': False,
                    'section_name': 'Basic Information',
                    'display_order': 2
                },
                {
                    'field_name': 'founded_date',
                    'field_label': 'Founded Date',
                    'field_type': 'date',
                    'is_required': False,
                    'section_name': 'Basic Information',
                    'display_order': 3
                },
                {
                    'field_name': 'company_type',
                    'field_label': 'Company Type',
                    'field_type': 'select',
                    'is_required': False,
                    'section_name': 'Basic Information',
                    'display_order': 4,
                    'field_options': [
                        {'value': '', 'label': 'Select type'},
                        {'value': 'Startup', 'label': 'Startup'},
                        {'value': 'SME', 'label': 'Small & Medium Enterprise'},
                        {'value': 'Corporation', 'label': 'Corporation'},
                        {'value': 'Non-profit', 'label': 'Non-profit'},
                        {'value': 'Government', 'label': 'Government'}
                    ]
                },
                {
                    'field_name': 'status',
                    'field_label': 'Status',
                    'field_type': 'select',
                    'is_required': False,
                    'section_name': 'Basic Information',
                    'display_order': 5,
                    'field_options': [
                        {'value': 'Operating', 'label': 'Operating'},
                        {'value': 'Stealth', 'label': 'Stealth Mode'},
                        {'value': 'Pre-launch', 'label': 'Pre-launch'},
                        {'value': 'Acquired', 'label': 'Acquired'},
                        {'value': 'Closed', 'label': 'Closed'}
                    ]
                },
                {
                    'field_name': 'employee_count',
                    'field_label': 'Employee Count',
                    'field_type': 'select',
                    'is_required': False,
                    'section_name': 'Basic Information',
                    'display_order': 6,
                    'field_options': [
                        {'value': '', 'label': 'Select range'},
                        {'value': '1', 'label': '1'},
                        {'value': '2-10', 'label': '2-10'},
                        {'value': '11-50', 'label': '11-50'},
                        {'value': '51-200', 'label': '51-200'},
                        {'value': '201-500', 'label': '201-500'},
                        {'value': '501-1000', 'label': '501-1000'},
                        {'value': '1000+', 'label': '1000+'}
                    ]
                },
                {
                    'field_name': 'short_description',
                    'field_label': 'Short Description',
                    'field_type': 'text',
                    'placeholder': 'Brief description of your company (max 200 characters)',
                    'is_required': True,
                    'section_name': 'Basic Information',
                    'display_order': 7,
                    'validation_rules': {'maxLength': 200}
                },
                {
                    'field_name': 'description',
                    'field_label': 'Detailed Description',
                    'field_type': 'textarea',
                    'placeholder': 'Detailed description of your company, products, and services',
                    'is_required': False,
                    'section_name': 'Basic Information',
                    'display_order': 8
                },

                # Location Section
                {
                    'field_name': 'hq_country',
                    'field_label': 'Country',
                    'field_type': 'text',
                    'placeholder': 'Enter country',
                    'is_required': True,
                    'section_name': 'Location',
                    'display_order': 9
                },
                {
                    'field_name': 'hq_city',
                    'field_label': 'City',
                    'field_type': 'text',
                    'placeholder': 'Enter city',
                    'is_required': True,
                    'section_name': 'Location',
                    'display_order': 10
                },
                {
                    'field_name': 'hq_address',
                    'field_label': 'Address',
                    'field_type': 'text',
                    'placeholder': 'Full address (optional)',
                    'is_required': False,
                    'section_name': 'Location',
                    'display_order': 11
                },

                # Contact Information Section
                {
                    'field_name': 'contact_email',
                    'field_label': 'Contact Email',
                    'field_type': 'email',
                    'placeholder': 'contact@company.com',
                    'is_required': True,
                    'section_name': 'Contact Information',
                    'display_order': 12
                },
                {
                    'field_name': 'contact_phone',
                    'field_label': 'Phone Number',
                    'field_type': 'tel',
                    'placeholder': '+1 (555) 123-4567',
                    'is_required': False,
                    'section_name': 'Contact Information',
                    'display_order': 13
                },

                # Social Media Section
                {
                    'field_name': 'linkedin_url',
                    'field_label': 'LinkedIn URL',
                    'field_type': 'url',
                    'placeholder': 'https://linkedin.com/company/yourcompany',
                    'is_required': False,
                    'section_name': 'Social Media & Links',
                    'display_order': 14
                },
                {
                    'field_name': 'twitter_url',
                    'field_label': 'Twitter URL',
                    'field_type': 'url',
                    'placeholder': 'https://twitter.com/yourcompany',
                    'is_required': False,
                    'section_name': 'Social Media & Links',
                    'display_order': 15
                },
                {
                    'field_name': 'facebook_url',
                    'field_label': 'Facebook URL',
                    'field_type': 'url',
                    'placeholder': 'https://facebook.com/yourcompany',
                    'is_required': False,
                    'section_name': 'Social Media & Links',
                    'display_order': 16
                },
                {
                    'field_name': 'logo_url',
                    'field_label': 'Logo URL',
                    'field_type': 'url',
                    'placeholder': 'https://example.com/logo.png',
                    'is_required': False,
                    'section_name': 'Social Media & Links',
                    'display_order': 17
                },

                # Funding Information Section
                {
                    'field_name': 'total_funding_raised_usd',
                    'field_label': 'Total Funding Raised (USD)',
                    'field_type': 'number',
                    'placeholder': '0',
                    'help_text': 'Enter the total amount of funding raised to date',
                    'is_required': False,
                    'section_name': 'Funding Information',
                    'display_order': 18,
                    'validation_rules': {'min': 0, 'step': 1000}
                },

                # Additional Information Section
                {
                    'field_name': 'tags',
                    'field_label': 'Tags',
                    'field_type': 'text',
                    'placeholder': 'AI, SaaS, B2B, Mobile (comma separated)',
                    'help_text': 'Add relevant tags separated by commas',
                    'is_required': False,
                    'section_name': 'Additional Information',
                    'display_order': 19
                },
                {
                    'field_name': 'notes',
                    'field_label': 'Additional Notes',
                    'field_type': 'textarea',
                    'placeholder': 'Any additional information you\'d like to share',
                    'is_required': False,
                    'section_name': 'Additional Information',
                    'display_order': 20
                }
            ]

            for field_data in form_fields_data:
                FormField.objects.create(
                    page_content=add_company_page,
                    **field_data
                )

        self.stdout.write(
            self.style.SUCCESS('Successfully populated initial data!')
        )