#!/usr/bin/env python3
"""
Check current state of registrations and companies
"""
import os
import sys
import django

# Setup Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Company, OrganizationRegistration

def check_current_state():
    print('=== CURRENT STATE ===')
    print(f'Companies: {Company.objects.count()}')
    print(f'Registrations: {OrganizationRegistration.objects.count()}')

    print('\n=== RECENT REGISTRATIONS ===')
    recent_regs = OrganizationRegistration.objects.order_by('-created_at')[:5]
    for reg in recent_regs:
        print(f'{reg.organization_name} - {reg.status} - {reg.created_at.strftime("%Y-%m-%d %H:%M")}')

    print('\n=== RECENT COMPANIES ===')
    recent_companies = Company.objects.order_by('-created_at')[:5]
    for company in recent_companies:
        print(f'{company.name} - {company.moderation_status} - {company.created_at.strftime("%Y-%m-%d %H:%M")}')

    print('\n=== PENDING REGISTRATIONS ===')
    pending = OrganizationRegistration.objects.filter(status='pending')
    print(f'Pending count: {pending.count()}')
    for reg in pending:
        print(f'  - {reg.organization_name} ({reg.email})')

if __name__ == "__main__":
    check_current_state()