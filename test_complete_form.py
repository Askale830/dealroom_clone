#!/usr/bin/env python3
"""
Test complete organization registration form data
"""
import requests
import json

API_BASE_URL = "http://localhost:8000/api"

def test_complete_form():
    """Test with complete form data matching frontend structure"""
    
    # Complete test data matching what frontend would send
    test_data = {
        # Organization Details
        "organization_type": "startup",
        "organization_name": "Complete Form Test Startup",
        "website": "https://completetest.com",
        "description": "A comprehensive test of the complete form with all fields filled",
        "founded_year": 2023,
        "employee_count": "11-50",
        "headquarters": "Addis Ababa",
        "country": "Ethiopia",
        
        # Contact Information
        "first_name": "Complete",
        "last_name": "Test",
        "email": "complete.test@example.com",
        "phone": "+251911234567",
        "position": "CEO & Founder",
        "linkedin_profile": "https://linkedin.com/in/completetest",
        
        # Additional Information
        "sectors": ["Fintech", "E-commerce", "Healthtech"],
        "funding_stage": "seed",  # Using correct value
        "total_funding": 250000.50,
        "key_achievements": "Successfully launched MVP, acquired 500+ customers, raised seed funding, established partnerships with 3 major banks",
        
        # Account & Preferences
        "subscribe_newsletter": True
    }
    
    print("Testing complete form data...")
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
            
            if response.status_code == 201:
                print("✅ Complete form test PASSED!")
                return True
            else:
                print("❌ Complete form test FAILED!")
                return False
        else:
            print(f"Response Text: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_minimal_form():
    """Test with minimal required data"""
    
    # Minimal required data
    test_data = {
        "organization_type": "startup",
        "organization_name": "Minimal Test Startup",
        "description": "A minimal test with only required fields",
        "headquarters": "Addis Ababa",
        "country": "Ethiopia",
        "first_name": "Minimal",
        "last_name": "Test",
        "email": "minimal.test@example.com",
        "position": "CEO",
        "sectors": [],
        "subscribe_newsletter": True
    }
    
    print("\nTesting minimal form data...")
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
            
            if response.status_code == 201:
                print("✅ Minimal form test PASSED!")
                return True
            else:
                print("❌ Minimal form test FAILED!")
                return False
        else:
            print(f"Response Text: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("COMPREHENSIVE ORGANIZATION FORM TESTING")
    print("=" * 60)
    
    complete_result = test_complete_form()
    minimal_result = test_minimal_form()
    
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"Complete Form Test: {'✅ PASS' if complete_result else '❌ FAIL'}")
    print(f"Minimal Form Test: {'✅ PASS' if minimal_result else '❌ FAIL'}")
    
    if complete_result and minimal_result:
        print("\n🎉 ALL TESTS PASSED! The organization registration form is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")