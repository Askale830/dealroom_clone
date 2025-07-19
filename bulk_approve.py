#!/usr/bin/env python3
"""
Bulk approve pending registrations
"""
import requests
import json

def bulk_approve_pending():
    """Approve all pending registrations"""
    
    print("🚀 BULK APPROVING PENDING REGISTRATIONS")
    print("=" * 50)
    
    try:
        # Get all registrations
        response = requests.get('http://localhost:8000/api/organization-registrations/')
        
        if response.status_code == 200:
            data = response.json()
            pending_regs = [reg for reg in data['results'] if reg['status'] == 'pending']
            
            print(f"Found {len(pending_regs)} pending registrations")
            
            approved_count = 0
            failed_count = 0
            
            for reg in pending_regs:
                reg_id = reg['id']
                reg_name = reg['organization_name']
                
                print(f"\nApproving: {reg_name} (ID: {reg_id})")
                
                # Approve the registration
                approve_response = requests.post(
                    f'http://localhost:8000/api/organization-registrations/{reg_id}/approve/'
                )
                
                if approve_response.status_code == 200:
                    approval_data = approve_response.json()
                    if approval_data.get('success'):
                        print(f"  ✅ Approved! Company ID: {approval_data.get('company_id')}")
                        approved_count += 1
                    else:
                        print(f"  ❌ Failed: {approval_data.get('message')}")
                        failed_count += 1
                else:
                    print(f"  ❌ HTTP Error: {approve_response.status_code}")
                    failed_count += 1
            
            print("\n" + "=" * 50)
            print("📊 BULK APPROVAL SUMMARY")
            print("=" * 50)
            print(f"✅ Successfully approved: {approved_count}")
            print(f"❌ Failed to approve: {failed_count}")
            print(f"📋 Total processed: {len(pending_regs)}")
            
            if approved_count > 0:
                print(f"\n🎉 {approved_count} organizations are now in the Companies database!")
                
        else:
            print(f"❌ Error getting registrations: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    bulk_approve_pending()