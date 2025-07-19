#!/usr/bin/env python3
"""
Simple test script to verify the organization registration API
"""
import requests
import json

API_BASE_URL = "http://localhost:8000/api"

def test_organization_registration():
    """Test creating an organization registration"""
    
    # Test data
    test_data = {
        "organization_type": "startup",
        "organization_name": "Test Startup Inc",
        "website": "https://teststartup.com",
        "description": "A test startup for API testing purposes",
        "founded_year": 2023,
        "employee_count": "1-10",
        "headquarters": "Addis Ababa",
        "country": "Ethiopia",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@teststartup.com",
        "phone": "+251911123456",
        "position": "CEO",
        "linkedin_profile": "https://linkedin.com/in/johndoe",
        "sectors": ["Fintech", "E-commerce"],
        "funding_stage": "seed",
        "total_funding": 100000.00,
        "key_achievements": "Successfully launched MVP and acquired first 100 customers",
        "subscribe_newsletter": True
    }
    
    print("Testing Organization Registration API...")
    print(f"Sending POST request to {API_BASE_URL}/organization-signup/")
    print(f"Data: {json.dumps(test_data, indent=2)}")
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/organization-signup/",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.headers.get('content-type', '').startswith('application/json'):
            response_data = response.json()
            print(f"Response Data: {json.dumps(response_data, indent=2)}")
            
            if response.status_code == 201:
                print("✅ Organization registration created successfully!")
                return response_data
            else:
                print("❌ Organization registration failed!")
                return None
        else:
            print(f"Response Text: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return None

def test_get_registrations():
    """Test getting organization registrations"""
    print("\nTesting Get Organization Registrations API...")
    print(f"Sending GET request to {API_BASE_URL}/organization-registrations/")
    
    try:
        response = requests.get(f"{API_BASE_URL}/organization-registrations/")
        
        print(f"\nResponse Status: {response.status_code}")
        
        if response.headers.get('content-type', '').startswith('application/json'):
            response_data = response.json()
            print(f"Response Data: {json.dumps(response_data, indent=2)}")
            
            if response.status_code == 200:
                print("✅ Successfully retrieved organization registrations!")
                return response_data
            else:
                print("❌ Failed to retrieve organization registrations!")
                return None
        else:
            print(f"Response Text: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return None

def test_api_connection():
    """Test basic API connection"""
    print("Testing API Connection...")
    print(f"Sending GET request to {API_BASE_URL}/test/")
    
    try:
        response = requests.get(f"{API_BASE_URL}/test/")
        
        print(f"\nResponse Status: {response.status_code}")
        
        if response.headers.get('content-type', '').startswith('application/json'):
            response_data = response.json()
            print(f"Response Data: {json.dumps(response_data, indent=2)}")
            
            if response.status_code == 200:
                print("✅ API connection successful!")
                return True
            else:
                print("❌ API connection failed!")
                return False
        else:
            print(f"Response Text: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("ORGANIZATION REGISTRATION API TEST")
    print("=" * 60)
    
    # Test API connection first
    if test_api_connection():
        print("\n" + "=" * 60)
        
        # Test organization registration
        registration_result = test_organization_registration()
        
        print("\n" + "=" * 60)
        
        # Test getting registrations
        get_result = test_get_registrations()
        
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"API Connection: {'✅ PASS' if True else '❌ FAIL'}")
        print(f"Organization Registration: {'✅ PASS' if registration_result else '❌ FAIL'}")
        print(f"Get Registrations: {'✅ PASS' if get_result else '❌ FAIL'}")
    else:
        print("\n❌ API connection failed. Make sure the Django server is running on localhost:8000")