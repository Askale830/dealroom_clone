#!/usr/bin/env python3
"""
Test with correct funding stage values
"""
import requests
import json

API_BASE_URL = "http://localhost:8000/api"

def test_with_funding_stage():
    """Test with correct funding stage value"""
    
    # Test data with correct funding stage
    test_data = {
        "organization_type": "startup",
        "organization_name": "Funding Stage Test Startup",
        "description": "A test with correct funding stage",
        "headquarters": "Addis Ababa",
        "country": "Ethiopia",
        "first_name": "Funding",
        "last_name": "Test",
        "email": "funding.test@example.com",
        "position": "CEO",
        "sectors": ["Fintech"],
        "funding_stage": "pre_seed",  # Correct value with underscore
        "total_funding": 50000.00,
        "subscribe_newsletter": True
    }
    
    print("Testing with correct funding stage...")
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
    test_with_funding_stage()