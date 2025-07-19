from django.core.management.base import BaseCommand
from api.models import Industry

class Command(BaseCommand):
    help = 'Create initial data for the application'

    def handle(self, *args, **options):
        # Create industries
        industries_data = [
            {'name': 'Technology', 'description': 'Software, hardware, and tech services'},
            {'name': 'Healthcare', 'description': 'Medical devices, pharmaceuticals, and health services'},
            {'name': 'Finance', 'description': 'Fintech, banking, and financial services'},
            {'name': 'E-commerce', 'description': 'Online retail and marketplace platforms'},
            {'name': 'Education', 'description': 'EdTech and educational services'},
            {'name': 'Entertainment', 'description': 'Media, gaming, and entertainment platforms'},
            {'name': 'Energy', 'description': 'Renewable energy and clean tech'},
            {'name': 'Transportation', 'description': 'Mobility and logistics solutions'},
            {'name': 'Real Estate', 'description': 'PropTech and real estate services'},
            {'name': 'Food & Beverage', 'description': 'Food tech and beverage industry'},
        ]

        for industry_data in industries_data:
            industry, created = Industry.objects.get_or_create(
                name=industry_data['name'],
                defaults={
                    'description': industry_data['description'],
                    'moderation_status': 'accepted'
                }
            )
            if not created and industry.moderation_status != 'accepted':
                industry.moderation_status = 'accepted'
                industry.save()
            if created:
                self.stdout.write(f"Created industry: {industry.name}")
            else:
                self.stdout.write(f"Industry already exists: {industry.name} (set to accepted)")

        self.stdout.write(self.style.SUCCESS('Successfully created initial data'))