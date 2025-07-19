#!/usr/bin/env python3
"""
Generate unique email suggestions for testing
"""
import random
import string
from datetime import datetime

def generate_unique_emails():
    """Generate several unique email suggestions"""
    
    timestamp = datetime.now().strftime("%Y%m%d%H%M")
    random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
    
    suggestions = [
        f"mycompany.{timestamp}@example.com",
        f"startup.{random_suffix}@test.com",
        f"neworg.{timestamp}@gmail.com",
        f"demo.company.{random_suffix}@outlook.com",
        f"test.{timestamp}.{random_suffix}@company.com"
    ]
    
    return suggestions

if __name__ == "__main__":
    print("🔧 UNIQUE EMAIL SUGGESTIONS")
    print("=" * 50)
    print("Use any of these emails for testing:")
    print()
    
    for i, email in enumerate(generate_unique_emails(), 1):
        print(f"{i}. {email}")
    
    print()
    print("💡 Tips:")
    print("- Use your actual email if this is a real organization")
    print("- Add current date/time to make emails unique")
    print("- Use different domains (gmail.com, outlook.com, etc.)")
    print()
    print("📋 Organization Name Tips:")
    print("- Add your location: 'YourCompany Addis Ababa'")
    print("- Add year: 'YourCompany 2024'")
    print("- Add type: 'YourCompany Startup'")