"""
Test script for API endpoints.
Run this after starting api_server.py
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5000"


def test_health_check():
    """Test health check endpoint."""
    print("\n" + "="*60)
    print("TEST 1: Health Check")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.status_code == 200


def test_submit_claim():
    """Test claim submission."""
    print("\n" + "="*60)
    print("TEST 2: Submit Claim")
    print("="*60)
    
    admission_date = datetime.now() - timedelta(days=5)
    discharge_date = datetime.now() - timedelta(days=1)
    
    claim_data = {
        "claim_id": "API_TEST_CLAIM_001",
        "documents": [
            {
                "document_type": "hospital_bill",
                "hospital_name": "Apollo Hospitals",
                "patient_id": "PAT_001",
                "admission_date": admission_date.isoformat(),
                "discharge_date": discharge_date.isoformat(),
                "total_amount": 35000,
                "has_stamp": True,
                "has_signature": True
            },
            {
                "document_type": "discharge_summary",
                "hospital_name": "Apollo Hospitals",
                "patient_id": "PAT_001",
                "admission_date": admission_date.isoformat(),
                "discharge_date": discharge_date.isoformat(),
                "diagnosis": "Acute Appendicitis",
                "has_signature": True
            }
        ]
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/claims",
        json=claim_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.status_code == 201


def test_verify_claim():
    """Test claim verification."""
    print("\n" + "="*60)
    print("TEST 3: Verify Claim")
    print("="*60)
    
    admission_date = datetime.now() - timedelta(days=5)
    discharge_date = datetime.now() - timedelta(days=1)
    
    verify_data = {
        "documents": [
            {
                "document_type": "hospital_bill",
                "hospital_name": "Apollo Hospitals",
                "patient_id": "PAT_001",
                "admission_date": admission_date.isoformat(),
                "discharge_date": discharge_date.isoformat(),
                "total_amount": 35000,
                "has_stamp": True,
                "has_signature": True
            },
            {
                "document_type": "discharge_summary",
                "hospital_name": "Apollo Hospitals",
                "patient_id": "PAT_001",
                "admission_date": admission_date.isoformat(),
                "discharge_date": discharge_date.isoformat(),
                "diagnosis": "Acute Appendicitis",
                "has_signature": True
            }
        ]
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/claims/API_TEST_CLAIM_001/verify",
        json=verify_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.status_code == 200


def test_get_claim_status():
    """Test getting claim status."""
    print("\n" + "="*60)
    print("TEST 4: Get Claim Status")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/api/v1/claims/API_TEST_CLAIM_001")
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.status_code == 200


def test_blockchain_state():
    """Test getting blockchain state."""
    print("\n" + "="*60)
    print("TEST 5: Get Blockchain State")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/api/v1/blockchain/state")
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.status_code == 200


def main():
    """Run all tests."""
    print("\n" + "="*70)
    print("API INTEGRATION TESTS")
    print("="*70)
    print("\nMake sure api_server.py is running on http://localhost:5000")
    input("Press Enter to start tests...")
    
    tests = [
        ("Health Check", test_health_check),
        ("Submit Claim", test_submit_claim),
        ("Verify Claim", test_verify_claim),
        ("Get Claim Status", test_get_claim_status),
        ("Blockchain State", test_blockchain_state)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            passed = test_func()
            results.append((test_name, passed))
        except Exception as e:
            print(f"\n❌ Test failed with error: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    
    for test_name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    total_passed = sum(1 for _, passed in results if passed)
    print(f"\nTotal: {total_passed}/{len(results)} tests passed")


if __name__ == "__main__":
    main()
