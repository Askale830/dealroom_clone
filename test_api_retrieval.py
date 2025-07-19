#!/usr/bin/env python3
"""
Test API data retrieval
"""
import requests
import json

def test_api_retrieval():
    """Test retrieving organization registrations"""
    
    print("Testing organization registrations API...")
    
    try:
        # Test both endpoints
        endpoints = [
            'http://localhost:8000/api/organization-registrations/',
            'http://localhost:8000/api/organization-registrations'
        ]
        
        for endpoint in endpoints:
            print(f"\nTesting endpoint: {endpoint}")
            response = requests.get(endpoint)
            print(f"Status Code: {response.status_code}")
            print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
            
                data = response.json()
                print(f"Total count: {data.get('count', 'N/A')}")
                print(f"Results length: {len(data.get('results', []))}")
                
                if data.get('results'):
                    print("First registration:")
                    first_reg = data['results'][0]
                    print(f"  ID: {first_reg.get('id')}")
                    print(f"  Name: {first_reg.get('organization_name')}")
                    print(f"  Email: {first_reg.get('email')}")
                    print(f"  Status: {first_reg.get('status')}")
                    print(f"  Created: {first_reg.get('created_at')}")
                    break  # Exit after first successful test
                else:
                    print("No results found")
            else:
                print(f"Error response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - is the Django server running?")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_api_retrieval()