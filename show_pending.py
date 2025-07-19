#!/usr/bin/env python3
"""
Show pending registrations
"""
import requests
import json

def show_pending_registrations():
    """Show all pending registrations"""
    
    print("🔍 CHECKING PENDING REGISTRATIONS")
    print("=" * 50)
    
    try:
        response = requests.get('http://localhost:8000/api/organization-registrations/')
        
        if response.status_code == 200:
            data = response.json()
            
            pending_regs = [reg for reg in data['results'] if reg['status'] == 'pending']
            
            print(f"Total registrations: {data['count']}")
            print(f"Pending registrations: {len(pending_regs)}")
            print()
            
            if pending_regs:
                print("📋 PENDING REGISTRATIONS:")
                for reg in pending_regs:
                    print(f"  ID: {reg['id']}")
                    print(f"  Name: {reg['organization_name']}")
                    print(f"  Email: {reg['email']}")
                    print(f"  Type: {reg['organization_type_display']}")
                    print(f"  Created: {reg['created_at']}")
                    print("  " + "-" * 40)
                
                print("\n💡 SOLUTIONS:")
                print("1. Approve these registrations manually via admin interface")
                print("2. Auto-approve new registrations (modify the code)")
                print("3. Bulk approve existing pending registrations")
                
            else:
                print("✅ No pending registrations found")
                
        else:
            print(f"❌ Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    show_pending_registrations()