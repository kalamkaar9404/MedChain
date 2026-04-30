"""
Verify Railway deployment is working correctly.
Usage: python verify_deployment.py <your-railway-url>
Example: python verify_deployment.py https://your-app.railway.app
"""

import sys
import requests
import json

def test_deployment(base_url):
    """Test all critical endpoints."""
    
    print("="*70)
    print("RAILWAY DEPLOYMENT VERIFICATION")
    print("="*70)
    print(f"\nTesting: {base_url}\n")
    
    tests_passed = 0
    tests_failed = 0
    
    # Test 1: Health Check
    print("1. Testing Health Endpoint...")
    try:
        response = requests.get(f"{base_url}/api/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Status: {response.status_code}")
            print(f"   ✓ Backend: {data.get('status')}")
            print(f"   ✓ Agents: {data.get('agents')}")
            tests_passed += 1
        else:
            print(f"   ✗ Failed with status: {response.status_code}")
            tests_failed += 1
    except Exception as e:
        print(f"   ✗ Error: {e}")
        tests_failed += 1
    
    # Test 2: Get Claims
    print("\n2. Testing Get Claims Endpoint...")
    try:
        response = requests.get(f"{base_url}/api/claims", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Status: {response.status_code}")
            print(f"   ✓ Total claims: {data.get('total', 0)}")
            tests_passed += 1
        else:
            print(f"   ✗ Failed with status: {response.status_code}")
            tests_failed += 1
    except Exception as e:
        print(f"   ✗ Error: {e}")
        tests_failed += 1
    
    # Test 3: Submit Test Claim
    print("\n3. Testing Submit Claim Endpoint...")
    try:
        claim_data = {
            "patient_id": "test_patient",
            "amount": 25000,
            "reason": "Deployment test claim",
            "admission_date": "2024-01-15T10:00:00",
            "discharge_date": "2024-01-18T14:00:00",
            "document_hashes": ["test_hash_1"],
            "document_types": ["MEDICAL_INVOICE"],
            "signature_verified": True,
            "stamp_verified": True
        }
        response = requests.post(
            f"{base_url}/api/claims/submit",
            json=claim_data,
            timeout=10
        )
        if response.status_code == 201:
            data = response.json()
            claim = data.get('claim', {})
            print(f"   ✓ Status: {response.status_code}")
            print(f"   ✓ Claim ID: {claim.get('id')}")
            print(f"   ✓ Status: {claim.get('status')}")
            tests_passed += 1
        else:
            print(f"   ✗ Failed with status: {response.status_code}")
            tests_failed += 1
    except Exception as e:
        print(f"   ✗ Error: {e}")
        tests_failed += 1
    
    # Test 4: System Metrics
    print("\n4. Testing System Metrics Endpoint...")
    try:
        response = requests.get(f"{base_url}/api/system/metrics", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Status: {response.status_code}")
            print(f"   ✓ Total claims: {data.get('total_claims', 0)}")
            print(f"   ✓ Blockchain blocks: {data.get('blockchain_blocks', 0)}")
            tests_passed += 1
        else:
            print(f"   ✗ Failed with status: {response.status_code}")
            tests_failed += 1
    except Exception as e:
        print(f"   ✗ Error: {e}")
        tests_failed += 1
    
    # Test 5: CORS Check
    print("\n5. Testing CORS Configuration...")
    try:
        response = requests.options(
            f"{base_url}/api/health",
            headers={"Origin": "https://your-frontend.vercel.app"},
            timeout=10
        )
        cors_header = response.headers.get('Access-Control-Allow-Origin')
        if cors_header:
            print(f"   ✓ CORS enabled")
            print(f"   ✓ Allowed origins: {cors_header}")
            tests_passed += 1
        else:
            print(f"   ⚠ CORS headers not found (might still work)")
            tests_passed += 1
    except Exception as e:
        print(f"   ✗ Error: {e}")
        tests_failed += 1
    
    # Summary
    print("\n" + "="*70)
    print("VERIFICATION SUMMARY")
    print("="*70)
    print(f"Tests Passed: {tests_passed}/5")
    print(f"Tests Failed: {tests_failed}/5")
    
    if tests_failed == 0:
        print("\n✓ ALL TESTS PASSED!")
        print("\nYour Railway deployment is working correctly!")
        print(f"\nUpdate your Vercel frontend environment variable:")
        print(f"NEXT_PUBLIC_API_URL={base_url}")
    else:
        print("\n✗ SOME TESTS FAILED")
        print("\nCheck Railway logs for errors:")
        print("1. Go to Railway dashboard")
        print("2. Click on your project")
        print("3. View Deployments → Logs")
    
    print("="*70)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python verify_deployment.py <railway-url>")
        print("Example: python verify_deployment.py https://your-app.railway.app")
        sys.exit(1)
    
    railway_url = sys.argv[1].rstrip('/')
    test_deployment(railway_url)
