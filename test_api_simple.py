"""Simple API test to verify endpoints work."""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5000"

def test_health():
    """Test health endpoint."""
    print("\n1. Testing Health Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"   Error: {e}")
        return False

def test_submit_claim():
    """Test claim submission."""
    print("\n2. Testing Claim Submission...")
    try:
        claim_data = {
            "patient_id": "test_patient_001",
            "amount": 35000,
            "reason": "Medical treatment",
            "admission_date": "2024-01-15T10:00:00",
            "discharge_date": "2024-01-18T14:00:00",
            "document_hashes": ["hash123", "hash456"],
            "document_types": ["MEDICAL_INVOICE", "DISCHARGE_SUMMARY"],
            "signature_verified": True,
            "stamp_verified": True
        }
        
        response = requests.post(f"{BASE_URL}/api/claims/submit", json=claim_data)
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Claim ID: {data.get('claim', {}).get('id')}")
        print(f"   Status: {data.get('claim', {}).get('status')}")
        return response.status_code == 201
    except Exception as e:
        print(f"   Error: {e}")
        return False

def test_get_claims():
    """Test getting claims list."""
    print("\n3. Testing Get Claims...")
    try:
        response = requests.get(f"{BASE_URL}/api/claims")
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Total Claims: {data.get('total')}")
        print(f"   Pending: {data.get('pending')}")
        print(f"   Processed: {data.get('processed')}")
        return response.status_code == 200
    except Exception as e:
        print(f"   Error: {e}")
        return False

def test_system_metrics():
    """Test system metrics."""
    print("\n4. Testing System Metrics...")
    try:
        response = requests.get(f"{BASE_URL}/api/system/metrics")
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Total Claims: {data.get('total_claims')}")
        print(f"   Blockchain Blocks: {data.get('blockchain_blocks')}")
        return response.status_code == 200
    except Exception as e:
        print(f"   Error: {e}")
        return False

def main():
    print("="*60)
    print("API TEST SUITE")
    print("="*60)
    print(f"\nTesting API at: {BASE_URL}")
    print("\nMake sure the backend is running: python api_server.py")
    
    results = []
    results.append(("Health Check", test_health()))
    results.append(("Submit Claim", test_submit_claim()))
    results.append(("Get Claims", test_get_claims()))
    results.append(("System Metrics", test_system_metrics()))
    
    print("\n" + "="*60)
    print("TEST RESULTS")
    print("="*60)
    for test_name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status} - {test_name}")
    
    total = len(results)
    passed = sum(1 for _, p in results if p)
    print(f"\nPassed: {passed}/{total}")
    print("="*60)

if __name__ == "__main__":
    main()
