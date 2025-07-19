#!/usr/bin/env python3
"""
Test admin API endpoints
"""
import requests
import json

def test_admin_endpoints():
    """Test admin API endpoints"""
    
    endpoints = [
        'http://localhost:8000/api/organization-registrations/',
        'http://localhost:8000/api/organization-registrations'
    ]
    
    for endpoint in endpoints:
        print(f"\n{'='*50}")
        print(f"Testing: {endpoint}")
        print('='*50)
        
        try:
            response = requests.get(endpoint)
            print(f"Status Code: {response.status_code}")
            print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Total count: {data.get('count', 'N/A')}")
                print(f"Results length: {len(data.get('results', []))}")
                
                if data.get('results'):
                    print("\nSample registration:")
                    first_reg = data['results'][0]
                    print(f"  ID: {first_reg.get('id')}")
                    print(f"  Name: {first_reg.get('organization_name')}")
                    print(f"  Email: {first_reg.get('email')}")
                    print(f"  Status: {first_reg.get('status')}")
                    
                    print(f"\n✅ SUCCESS: Found {len(data['results'])} registrations")
                    return True
                else:
                    print("❌ No results found")
            else:
                print(f"❌ Error response: {response.text}")
                
        except Exception as e:
            print(f"❌ Exception: {e}")
    
    return False

if __name__ == "__main__":
    test_admin_endpoints()