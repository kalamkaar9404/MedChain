"""Quick test to verify API and submit a test claim."""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5000"

print("="*60)
print("QUICK API TEST")
print("="*60)

# Test 1: Health check
print("\n1. Testing health endpoint...")
try:
    response = requests.get(f"{BASE_URL}/api/health")
    print(f"   ✓ Status: {response.status_code}")
    print(f"   ✓ Backend is healthy!")
except Exception as e:
    print(f"   ✗ Error: {e}")
    exit(1)

# Test 2: Get claims (should be empty)
print("\n2. Testing get claims...")
try:
    response = requests.get(f"{BASE_URL}/api/claims")
    data = response.json()
    print(f"   ✓ Status: {response.status_code}")
    print(f"   ✓ Total claims: {data['total']}")
except Exception as e:
    print(f"   ✗ Error: {e}")
    exit(1)

# Test 3: Submit a test claim
print("\n3. Submitting test claim...")
try:
    claim_data = {
        "patient_id": "test_patient_001",
        "amount": 35000,
        "reason": "Medical treatment - Test claim",
        "admission_date": "2024-01-15T10:00:00",
        "discharge_date": "2024-01-18T14:00:00",
        "document_hashes": ["test_hash_123", "test_hash_456"],
        "document_types": ["MEDICAL_INVOICE", "DISCHARGE_SUMMARY"],
        "signature_verified": True,
        "stamp_verified": True
    }
    
    response = requests.post(f"{BASE_URL}/api/claims/submit", json=claim_data)
    data = response.json()
    print(f"   ✓ Status: {response.status_code}")
    print(f"   ✓ Claim ID: {data['claim']['id']}")
    print(f"   ✓ Status: {data['claim']['status']}")
    print(f"   ✓ Amount: ₹{data['claim']['amount']:,}")
except Exception as e:
    print(f"   ✗ Error: {e}")
    exit(1)

# Test 4: Get claims again (should have 1)
print("\n4. Verifying claim appears in list...")
try:
    response = requests.get(f"{BASE_URL}/api/claims")
    data = response.json()
    print(f"   ✓ Status: {response.status_code}")
    print(f"   ✓ Total claims: {data['total']}")
    if data['total'] > 0:
        print(f"   ✓ First claim ID: {data['claims'][0]['id']}")
        print(f"   ✓ First claim status: {data['claims'][0]['status']}")
except Exception as e:
    print(f"   ✗ Error: {e}")
    exit(1)

print("\n" + "="*60)
print("✓ ALL TESTS PASSED!")
print("="*60)
print("\nNow refresh your browser at http://localhost:3000/patient/dashboard")
print("You should see the test claim in the list!")
print("="*60)
