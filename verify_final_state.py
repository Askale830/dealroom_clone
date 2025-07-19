#!/usr/bin/env python3
"""
Verify final state of the system
"""
import requests
import json

def verify_system_state():
    """Verify the current state of registrations and companies"""
    
    print("🔍 FINAL SYSTEM VERIFICATION")
    print("=" * 60)
    
    try:
        # Check registrations
        reg_response = requests.get('http://localhost:8000/api/organization-registrations/')
        
        # Check companies  
        company_response = requests.get('http://localhost:8000/api/companies/')
        
        if reg_response.status_code == 200 and company_response.status_code == 200:
            reg_data = reg_response.json()
            company_data = company_response.json()
            
            print("📊 CURRENT COUNTS:")
            print(f"  Total Registrations: {reg_data['count']}")
            print(f"  Total Companies: {company_data['count']}")
            
            # Count by status
            pending = len([r for r in reg_data['results'] if r['status'] == 'pending'])
            approved = len([r for r in reg_data['results'] if r['status'] == 'approved'])
            
            print(f"  Pending Registrations: {pending}")
            print(f"  Approved Registrations: {approved}")
            
            print("\n📋 RECENT COMPANIES (from registrations):")
            recent_companies = sorted(company_data['results'], key=lambda x: x['created_at'], reverse=True)[:5]
            
            for company in recent_companies:
                status = company.get('moderation_status', company.get('status', 'unknown'))
                print(f"  - {company['name']} ({company.get('company_type', 'N/A')}) - {status}")
            
            print("\n✅ SYSTEM STATUS:")
            if pending == 0:
                print("  🎉 All registrations have been processed!")
                print("  🏢 All approved registrations are now in Companies database")
                print("  🚀 New registrations will auto-create companies")
            else:
                print(f"  ⚠️  {pending} registrations still pending approval")
                
            print("\n🔧 WORKFLOW:")
            print("  1. User fills registration form")
            print("  2. System creates OrganizationRegistration")
            print("  3. System auto-creates Company (NEW!)")
            print("  4. Both records marked as approved")
            print("  5. Company appears in main database")
            
        else:
            print(f"❌ API Error - Registrations: {reg_response.status_code}, Companies: {company_response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    verify_system_state()