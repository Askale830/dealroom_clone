#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime, timedelta
from decimal import Decimal

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_config.settings')
django.setup()

from api.models import Company, Industry, FundingRound, Investor, FundingRoundParticipation

def create_sample_data():
    print("Creating sample data for Ethiopia Dealroom...")
    
    # Create industries
    industries_data = [
        "Fintech", "E-commerce", "Healthtech", "Edtech", "Agtech", 
        "Logistics", "Energy", "Entertainment", "B2B Software", "Marketplace"
    ]
    
    industries = []
    for industry_name in industries_data:
        industry, created = Industry.objects.get_or_create(
            name=industry_name,
            defaults={
                'description': f'{industry_name} sector in Ethiopia',
                'moderation_status': 'accepted'
            }
        )
        industries.append(industry)
        if created:
            print(f"Created industry: {industry_name}")
    
    # Create sample companies
    companies_data = [
        {
            'name': 'Chapa',
            'short_description': 'Comprehensive payment solutions with data-driven analytics, risk management, and retail services for global transactions',
            'employee_count_range': '51-200',
            'total_funding_raised_usd': 5000000,
            'status': 'Operating',
            'hq_city': 'Addis Ababa',
            'hq_country': 'Ethiopia',
            'industry': 'Fintech'
        },
        {
            'name': 'Lersha',
            'short_description': 'Lersha is an innovative digital solution for smallholder and commercial farmers in Ethiopia',
            'employee_count_range': '11-50',
            'total_funding_raised_usd': 1200000,
            'status': 'Operating',
            'hq_city': 'Addis Ababa',
            'hq_country': 'Ethiopia',
            'industry': 'Agtech'
        },
        {
            'name': 'Dodai',
            'short_description': 'Dodai Manufacturing PLC, a Japanese firm in Ethiopia, presently assembles and markets electric motorcycles in Addis Ababa',
            'employee_count_range': '51-200',
            'total_funding_raised_usd': 8500000,
            'status': 'Operating',
            'hq_city': 'Addis Ababa',
            'hq_country': 'Ethiopia',
            'industry': 'Energy'
        },
        {
            'name': 'EPhone App',
            'short_description': 'Helping people manage their sms and ussd codes in a more efficient way',
            'employee_count_range': '11-50',
            'total_funding_raised_usd': 500000,
            'status': 'Operating',
            'hq_city': 'Addis Ababa',
            'hq_country': 'Ethiopia',
            'industry': 'B2B Software'
        },
        {
            'name': 'Beemi',
            'short_description': 'A live-entertainment platform where one can earn as a creator by playing games together with live audience',
            'employee_count_range': '1-10',
            'total_funding_raised_usd': 300000,
            'status': 'Operating',
            'hq_city': 'Addis Ababa',
            'hq_country': 'Ethiopia',
            'industry': 'Entertainment'
        }
    ]
    
    companies = []
    for company_data in companies_data:
        industry = Industry.objects.get(name=company_data['industry'])
        company, created = Company.objects.get_or_create(
            name=company_data['name'],
            defaults={
                'short_description': company_data['short_description'],
                'employee_count_range': company_data['employee_count_range'],
                'total_funding_raised_usd': Decimal(str(company_data['total_funding_raised_usd'])),
                'status': company_data['status'],
                'hq_city': company_data['hq_city'],
                'hq_country': company_data['hq_country'],
                'moderation_status': 'accepted',
                'slug': company_data['name'].lower().replace(' ', '-')
            }
        )
        if created:
            company.industries.add(industry)
            companies.append(company)
            print(f"Created company: {company_data['name']}")
    
    # Create sample investors
    investors_data = [
        'Venture Capital Ethiopia', 'East Africa Ventures', 'Addis Ventures', 
        'Horn of Africa Capital', 'Ethiopian Investment Fund'
    ]
    
    investors = []
    for investor_name in investors_data:
        investor, created = Investor.objects.get_or_create(
            name=investor_name,
            defaults={
                'investor_type': 'Venture Capital',
                'hq_city': 'Addis Ababa',
                'hq_country': 'Ethiopia',
                'moderation_status': 'accepted',
                'slug': investor_name.lower().replace(' ', '-')
            }
        )
        investors.append(investor)
        if created:
            print(f"Created investor: {investor_name}")
    
    # Create sample funding rounds
    funding_rounds_data = [
        {
            'company': 'Chapa',
            'round_type': 'Series A',
            'money_raised_usd': 4000000,
            'announced_date': datetime(2024, 3, 15),
            'investor': 'East Africa Ventures'
        },
        {
            'company': 'Dodai',
            'round_type': 'Series B',
            'money_raised_usd': 6500000,
            'announced_date': datetime(2024, 8, 22),
            'investor': 'Horn of Africa Capital'
        },
        {
            'company': 'Lersha',
            'round_type': 'Seed',
            'money_raised_usd': 800000,
            'announced_date': datetime(2023, 11, 10),
            'investor': 'Venture Capital Ethiopia'
        },
        {
            'company': 'EPhone App',
            'round_type': 'Seed',
            'money_raised_usd': 400000,
            'announced_date': datetime(2023, 6, 5),
            'investor': 'Addis Ventures'
        },
        {
            'company': 'Beemi',
            'round_type': 'Pre-seed',
            'money_raised_usd': 250000,
            'announced_date': datetime(2024, 1, 12),
            'investor': 'Ethiopian Investment Fund'
        }
    ]
    
    for round_data in funding_rounds_data:
        company = Company.objects.get(name=round_data['company'])
        investor = Investor.objects.get(name=round_data['investor'])
        
        funding_round, created = FundingRound.objects.get_or_create(
            company=company,
            round_type=round_data['round_type'],
            announced_date=round_data['announced_date'],
            defaults={
                'money_raised_usd': Decimal(str(round_data['money_raised_usd']))
            }
        )
        if created:
            # Create the participation relationship
            FundingRoundParticipation.objects.get_or_create(
                funding_round=funding_round,
                investor=investor,
                defaults={
                    'is_lead_investor': True
                }
            )
            print(f"Created funding round: {company.name} - {round_data['round_type']}")
    
    print("\nSample data creation completed!")
    print(f"Created {Company.objects.filter(moderation_status='accepted').count()} companies")
    print(f"Created {Industry.objects.filter(moderation_status='accepted').count()} industries")
    print(f"Created {Investor.objects.filter(moderation_status='accepted').count()} investors")
    print(f"Created {FundingRound.objects.count()} funding rounds")

if __name__ == '__main__':
    create_sample_data()