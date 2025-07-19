#!/usr/bin/env python3
"""
Test organization approval workflow
"""
import requests
import json

def test_approval_workflow():
    """Test approving an organization registration"""
    
    # First, get the latest registration
    print("Getting latest registration...")
    response = requests.get('http://localhost:8000/api/organization-registrations/')
    
    if response.status_code == 200:
        data = response.json()
        if data['results']:
            latest_reg = data['results'][0]  # Most recent first
            reg_id = latest_reg['id']
            reg_name = latest_reg['organization_name']
            
            print(f"Found registration: {reg_name} (ID: {reg_id})")
            print(f"Status: {latest_reg['status']}")
            
            if latest_reg['status'] == 'pending':
                # Test approval
                print(f"\nApproving registration {reg_id}...")
                approve_response = requests.post(
                    f'http://localhost:8000/api/organization-registrations/{reg_id}/approve/'
                )
                
                print(f"Approval Status: {approve_response.status_code}")
                
                if approve_response.headers.get('content-type', '').startswith('application/json'):
                    approval_data = approve_response.json()
                    print(f"Approval Response: {json.dumps(approval_data, indent=2)}")
                    
                    if approval_data.get('success'):
                        print("✅ Registration approved successfully!")
                        
                        # Check if company was created
                        if 'company_id' in approval_data:
                            company_id = approval_data['company_id']
                            print(f"\n🏢 Company created with ID: {company_id}")
                            
                            # Verify company exists
                            company_response = requests.get(f'http://localhost:8000/api/companies/{company_id}/')
                            if company_response.status_code == 200:
                                company_data = company_response.json()
                                print(f"Company Name: {company_data.get('name')}")
                                print(f"Company Type: {company_data.get('company_type')}")
                                print(f"Status: {company_data.get('moderation_status')}")
                                return True
                            else:
                                print(f"❌ Could not retrieve company: {company_response.status_code}")
                        else:
                            print("⚠️ No company_id in response")
                    else:
                        print(f"❌ Approval failed: {approval_data.get('message')}")
                else:
                    print(f"❌ Non-JSON response: {approve_response.text}")
            else:
                print(f"⚠️ Registration is not pending (status: {latest_reg['status']})")
        else:
            print("❌ No registrations found")
    else:
        print(f"❌ Failed to get registrations: {response.status_code}")
    
    return False

if __name__ == "__main__":
    print("=" * 60)
    print("TESTING ORGANIZATION APPROVAL WORKFLOW")
    print("=" * 60)
    
    success = test_approval_workflow()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 APPROVAL WORKFLOW TEST PASSED!")
        print("✅ Registration → Company creation working correctly")
    else:
        print("❌ APPROVAL WORKFLOW TEST FAILED!")
        print("⚠️ Check the errors above")