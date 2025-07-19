#!/usr/bin/env python3
"""
Simple test to debug the organization registration API
"""
import requests
import json

API_BASE_URL = "http://localhost:8000/api"

def test_simple_registration():
    """Test with minimal data"""
    
    # Minimal test data
    test_data = {
        "organization_type": "startup",
        "organization_name": "Simple Test Startup",
        "description": "A simple test",
        "headquarters": "Addis Ababa",
        "country": "Ethiopia",
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@example.com",
        "position": "CEO"
    }
    
    print("Testing with minimal data...")
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
        else:
            print(f"Response Text: {response.text}")
            
        return response.status_code == 201
            
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    test_simple_registration()