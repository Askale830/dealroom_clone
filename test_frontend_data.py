#!/usr/bin/env python3
"""
Test with data structure similar to what frontend sends
"""
import requests
import json

API_BASE_URL = "http://localhost:8000/api"

def test_frontend_like_data():
    """Test with data structure similar to frontend"""
    
    # Data structure similar to what frontend sends
    test_data = {
        "organization_type": "startup",
        "organization_name": "Frontend Test Startup",
        "website": "",  # Empty string instead of null
        "description": "A test startup from frontend",
        "founded_year": None,
        "employee_count": "",  # Empty string
        "headquarters": "Addis Ababa",
        "country": "Ethiopia",
        "first_name": "John",
        "last_name": "Doe",
        "email": "frontend.test@example.com",
        "phone": "",  # Empty string
        "position": "CEO",
        "linkedin_profile": "",  # Empty string
        "sectors": [],  # Empty array
        "funding_stage": "",  # Empty string
        "total_funding": None,
        "key_achievements": "",  # Empty string
        "subscribe_newsletter": True
    }
    
    print("Testing with frontend-like data...")
    print(f"Data: {json.dumps(test_data, indent=2)}")
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/organization-signup/",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\nResponse Status: {response.status_code}")
        
        if response.headers.get('content-type', '').startswith('application/json'):
            response_data = response.json()
            print(f"Response Data: {json.dumps(response_data, indent=2)}")
        else:
            print(f"Response Text: {response.text}")
            
        return response.status_code == 201
            
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    test_frontend_like_data()