#!/usr/bin/env python3
"""
Test new organization registration with unique email
"""
import requests
import json
import random
import string

def generate_unique_email():
    """Generate a unique email for testing"""
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test.{random_string}@example.com"

def test_new_registration():
    """Test with a unique email"""
    
    unique_email = generate_unique_email()
    
    test_data = {
        "organization_type": "startup",
        "organization_name": f"Test Startup {random.randint(1000, 9999)}",
        "description": "A test startup with unique email",
        "headquarters": "Addis Ababa",
        "country": "Ethiopia",
        "first_name": "Test",
        "last_name": "User",
        "email": unique_email,
        "position": "CEO",
        "sectors": ["Fintech"],
        "funding_stage": "pre_seed",
        "subscribe_newsletter": True
    }
    
    print("Testing new registration with unique data...")
    print(f"Email: {unique_email}")
    print(f"Organization: {test_data['organization_name']}")
    
    try:
        response = requests.post(
            "http://localhost:8000/api/organization-signup/",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\nResponse Status: {response.status_code}")
        
        if response.headers.get('content-type', '').startswith('application/json'):
            response_data = response.json()
            print(f"Response: {json.dumps(response_data, indent=2)}")
            
            if response.status_code == 201:
                print("✅ SUCCESS: New registration created!")
                return True
            else:
                print("❌ FAILED: Registration not created")
                return False
        else:
            print(f"Response Text: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_new_registration()