"""
Simple test without emojis for Windows compatibility.
"""

import sys
import io

# Set UTF-8 encoding for Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from blockchain_layer import BlockchainRegistry, SmartContract
from document_processor import DocumentProcessor
from agents import PatientAgent
from advanced_agents import AdvancedInsurerAgent, AdvancedAuditAgent
import config


def test_1_low_risk():
    """Test low risk claim."""
    print("\n[TEST 1] Low Risk Claim - Auto Approval")
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
    insurer_agent = AdvancedInsurerAgent(config.INSURER_AGENT_ID, blockchain)
    
    doc_processor = DocumentProcessor()
    hospital_bill = doc_processor.extract_bill_data()
    hospital_bill["total_amount"] = 25000
    discharge_summary = doc_processor.extract_discharge_summary()
    
    documents = [hospital_bill, discharge_summary]
    
    claim_id = "TEST_001"
    patient_agent.submit_claim(claim_id, documents, smart_contract)
    result = insurer_agent.make_decision(claim_id, smart_contract, documents)
    
    assert result["status"] == "approved_and_paid"
    assert result["risk_score"] < 0.3
    print("[PASS] Test 1")
    return True


def test_2_clawback():
    """Test clawback scenario."""
    print("\n[TEST 2] Clawback Scenario")
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
    insurer_agent = AdvancedInsurerAgent(config.INSURER_AGENT_ID, blockchain)
    audit_agent = AdvancedAuditAgent(config.AUDIT_AGENT_ID, blockchain)
    
    doc_processor = DocumentProcessor()
    hospital_bill = doc_processor.extract_bill_data()
    discharge_summary = doc_processor.extract_discharge_summary()
    
    documents = [hospital_bill, discharge_summary]
    
    claim_id = "TEST_002"
    patient_agent.submit_claim(claim_id, documents, smart_contract)
    result = insurer_agent.make_decision(claim_id, smart_contract, documents)
    
    anomalous_doc = doc_processor.create_anomalous_document()
    all_documents = documents + [anomalous_doc]
    
    audit_result = audit_agent.deep_audit(claim_id, smart_contract, all_documents)
    
    assert audit_result["status"] in ["clawback_initiated", "flagged_for_monitoring"]
    print("[PASS] Test 2")
    return True


def test_3_blockchain():
    """Test blockchain integrity."""
    print("\n[TEST 3] Blockchain Integrity")
    
    blockchain = BlockchainRegistry()
    doc_processor = DocumentProcessor()
    
    doc = {"test": "data", "amount": 1000}
    doc_hash = doc_processor.generate_document_hash(doc)
    blockchain.store_hash("TEST_DOC", doc_hash, {"type": "test"})
    
    assert blockchain.verify_hash("TEST_DOC", doc_hash)
    assert not blockchain.verify_hash("TEST_DOC", "0" * 64)
    
    print("[PASS] Test 3")
    return True


def test_4_smart_contract():
    """Test smart contract."""
    print("\n[TEST 4] Smart Contract Logic")
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    claim = smart_contract.create_claim("TEST_SC", "patient_001", 50000, ["doc1"])
    assert claim["status"] == "pending"
    
    initial_balance = smart_contract.escrow_balance
    tx = smart_contract.approve_and_pay("TEST_SC", "insurer_001")
    assert smart_contract.escrow_balance == initial_balance - 50000
    
    clawback_tx = smart_contract.initiate_clawback("TEST_SC", "Test", 25000, "audit_001")
    assert smart_contract.escrow_balance == initial_balance - 25000
    
    print("[PASS] Test 4")
    return True


def main():
    """Run all tests."""
    print("\n" + "="*60)
    print("SYSTEM TEST SUITE")
    print("="*60)
    
    tests = [
        ("Low Risk Claim", test_1_low_risk),
        ("Clawback Scenario", test_2_clawback),
        ("Blockchain Integrity", test_3_blockchain),
        ("Smart Contract Logic", test_4_smart_contract)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            passed = test_func()
            results.append((test_name, True))
        except Exception as e:
            print(f"[FAIL] {test_name}: {str(e)}")
            results.append((test_name, False))
    
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    for test_name, passed in results:
        status = "[PASS]" if passed else "[FAIL]"
        print(f"{status} {test_name}")
    
    total_passed = sum(1 for _, passed in results if passed)
    print(f"\nTOTAL: {total_passed}/{len(results)} tests passed")
    print("="*60)
    
    if total_passed == len(results):
        print("\nALL TESTS PASSED - SYSTEM FULLY FUNCTIONAL")
        return 0
    else:
        print("\nSOME TESTS FAILED")
        return 1


if __name__ == "__main__":
    exit(main())
