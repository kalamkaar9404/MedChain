"""
Integration test script to verify frontend-backend connection.
Run this after starting the backend server.
"""

import requests
import json
from datetime import datetime

API_BASE_URL = "http://localhost:5000"

def print_header(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")


def test_health_check():
    """Test 1: Health check endpoint."""
    print_header("TEST 1: Health Check")
    
    try:
        response = requests.get(f"{API_BASE_URL}/api/health")
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        assert response.status_code == 200
        assert data["success"] == True
        print("\n✅ PASSED")
        return True
    except Exception as e:
        print(f"\n❌ FAILED: {e}")
        return False


def test_submit_claim():
    """Test 2: Submit a claim."""
    print_header("TEST 2: Submit Claim")
    
    try:
        payload = {
            "patientId": "PAT_TEST_001",
            "documents": [
                {
                    "type": "hospital_bill",
                    "amount": 35000,
                    "hasSignature": True,
                    "hasStamp": True,
                    "admissionDate": "2026-04-25",
                    "dischargeDate": "2026-04-29",
                    "hospitalName": "Test Hospital"
                }
            ]
        }
        
        response = requests.post(
            f"{API_BASE_URL}/api/claims/submit",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        assert response.status_code == 201
        assert data["success"] == True
        
        claim_id = data["data"]["claimId"]
        print(f"\n✅ PASSED - Claim ID: {claim_id}")
        return claim_id
    except Exception as e:
        print(f"\n❌ FAILED: {e}")
        return None


def test_get_claims():
    """Test 3: Get all claims."""
    print_header("TEST 3: Get Claims")
    
    try:
        response = requests.get(f"{API_BASE_URL}/api/claims")
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Total Claims: {data['data']['total']}")
        
        if data['data']['claims']:
            print(f"\nFirst Claim:")
            print(json.dumps(data['data']['claims'][0], indent=2))
        
        assert response.status_code == 200
        assert data["success"] == True
        print("\n✅ PASSED")
        return True
    except Exception as e:
        print(f"\n❌ FAILED: {e}")
        return False


def test_verify_claim(claim_id):
    """Test 4: Verify a claim."""
    print_header("TEST 4: Verify Claim")
    
    if not claim_id:
        print("⚠️  SKIPPED - No claim ID available")
        return False
    
    try:
        response = requests.post(f"{API_BASE_URL}/api/claims/{claim_id}/verify")
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        assert response.status_code == 200
        assert data["success"] == True
        
        result = data["data"].get("verificationResult", {})
        print(f"\nVerification Result:")
        print(f"  Status: {result.get('status')}")
        print(f"  Risk Score: {result.get('risk_score')}")
        print(f"  Confidence: {result.get('confidence')}")
        
        print("\n✅ PASSED")
        return True
    except Exception as e:
        print(f"\n❌ FAILED: {e}")
        return False


def test_blockchain_state():
    """Test 5: Get blockchain state."""
    print_header("TEST 5: Blockchain State")
    
    try:
        response = requests.get(f"{API_BASE_URL}/api/blockchain/state")
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        assert response.status_code == 200
        assert data["success"] == True
        print("\n✅ PASSED")
        return True
    except Exception as e:
        print(f"\n❌ FAILED: {e}")
        return False


def test_demo_scenario():
    """Test 6: Run demo scenario."""
    print_header("TEST 6: Demo Scenario")
    
    try:
        payload = {"scenario_id": "instant-payment"}
        
        response = requests.post(
            f"{API_BASE_URL}/api/demo/run-scenario",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        assert response.status_code == 200
        assert data["success"] == True
        print("\n✅ PASSED")
        return True
    except Exception as e:
        print(f"\n❌ FAILED: {e}")
        return False


def main():
    """Run all integration tests."""
    print("\n" + "="*60)
    print("FRONTEND-BACKEND INTEGRATION TESTS")
    print("="*60)
    print("\nMake sure the backend is running on http://localhost:5000")
    print("Start it with: python api_server_enhanced.py")
    
    input("\nPress Enter to start tests...")
    
    results = []
    
    # Test 1: Health check
    results.append(("Health Check", test_health_check()))
    
    # Test 2: Submit claim
    claim_id = test_submit_claim()
    results.append(("Submit Claim", claim_id is not None))
    
    # Test 3: Get claims
    results.append(("Get Claims", test_get_claims()))
    
    # Test 4: Verify claim
    results.append(("Verify Claim", test_verify_claim(claim_id)))
    
    # Test 5: Blockchain state
    results.append(("Blockchain State", test_blockchain_state()))
    
    # Test 6: Demo scenario
    results.append(("Demo Scenario", test_demo_scenario()))
    
    # Summary
    print_header("TEST SUMMARY")
    
    for test_name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    total_passed = sum(1 for _, passed in results if passed)
    print(f"\nTotal: {total_passed}/{len(results)} tests passed")
    
    if total_passed == len(results):
        print("\n🎉 ALL TESTS PASSED - Integration is working!")
        print("\nYou can now:")
        print("  1. Start the frontend: cd frontend && pnpm dev")
        print("  2. Open http://localhost:3000")
        print("  3. Test the complete flow in the UI")
    else:
        print("\n⚠️  SOME TESTS FAILED - Check the errors above")
        print("\nTroubleshooting:")
        print("  1. Make sure backend is running: python api_server_enhanced.py")
        print("  2. Check for port conflicts (port 5000)")
        print("  3. Verify all dependencies are installed")


if __name__ == "__main__":
    main()
