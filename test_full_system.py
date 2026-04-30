"""
Comprehensive system test - runs all scenarios without user input.
"""

from blockchain_layer import BlockchainRegistry, SmartContract
from document_processor import DocumentProcessor
from agents import PatientAgent
from advanced_agents import AdvancedInsurerAgent, AdvancedAuditAgent
import config


def print_header(title: str):
    """Print formatted section header."""
    print(f"\n\n{'#'*70}")
    print(f"# {title.center(66)} #")
    print(f"{'#'*70}\n")


def test_scenario_1():
    """Test low risk claim."""
    print_header("TEST 1: LOW RISK CLAIM - AUTO APPROVAL")
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
    insurer_agent = AdvancedInsurerAgent(config.INSURER_AGENT_ID, blockchain)
    
    doc_processor = DocumentProcessor()
    hospital_bill = doc_processor.extract_bill_data()
    hospital_bill["total_amount"] = 25000
    discharge_summary = doc_processor.extract_discharge_summary()
    
    documents = [hospital_bill, discharge_summary]
    
    claim_id = "TEST_CLAIM_001"
    patient_agent.submit_claim(claim_id, documents, smart_contract)
    result = insurer_agent.make_decision(claim_id, smart_contract, documents)
    
    assert result["status"] == "approved_and_paid", "Expected auto-approval"
    assert result["risk_score"] < 0.3, "Expected low risk score"
    assert result["confidence"] > 0.9, "Expected high confidence"
    
    print("\n✅ TEST 1 PASSED")
    return True


def test_scenario_2():
    """Test medium risk claim."""
    print_header("TEST 2: MEDIUM RISK CLAIM - APPROVE WITH MONITORING")
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
    insurer_agent = AdvancedInsurerAgent(config.INSURER_AGENT_ID, blockchain)
    
    doc_processor = DocumentProcessor()
    hospital_bill = doc_processor.extract_bill_data()
    hospital_bill["total_amount"] = 75000
    hospital_bill["treatment_details"] = [
        {"item": "Surgery", "amount": 50000},
        {"item": "Room", "amount": 15000},
        {"item": "Medicines", "amount": 10000}
    ]
    discharge_summary = doc_processor.extract_discharge_summary()
    
    documents = [hospital_bill, discharge_summary]
    
    claim_id = "TEST_CLAIM_002"
    patient_agent.submit_claim(claim_id, documents, smart_contract)
    result = insurer_agent.make_decision(claim_id, smart_contract, documents)
    
    assert result["status"] in ["approved_and_paid", "approved_with_monitoring"], "Expected approval"
    assert result["risk_score"] >= 0.2, "Expected medium risk score"
    
    print("\n✅ TEST 2 PASSED")
    return True


def test_scenario_3():
    """Test clawback scenario."""
    print_header("TEST 3: CLAWBACK SCENARIO")
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
    insurer_agent = AdvancedInsurerAgent(config.INSURER_AGENT_ID, blockchain)
    audit_agent = AdvancedAuditAgent(config.AUDIT_AGENT_ID, blockchain)
    
    doc_processor = DocumentProcessor()
    hospital_bill = doc_processor.extract_bill_data()
    discharge_summary = doc_processor.extract_discharge_summary()
    
    documents = [hospital_bill, discharge_summary]
    
    claim_id = "TEST_CLAIM_003"
    patient_agent.submit_claim(claim_id, documents, smart_contract)
    result = insurer_agent.make_decision(claim_id, smart_contract, documents)
    
    assert result["status"] in ["approved_and_paid", "approved_with_monitoring"], "Expected initial approval"
    
    # Add anomalous document
    anomalous_doc = doc_processor.create_anomalous_document()
    all_documents = documents + [anomalous_doc]
    
    # Audit
    audit_result = audit_agent.deep_audit(claim_id, smart_contract, all_documents)
    
    assert audit_result["status"] in ["clawback_initiated", "flagged_for_monitoring"], "Expected clawback or flag"
    assert len(audit_result["anomalies"]) > 0, "Expected anomalies detected"
    
    print("\n✅ TEST 3 PASSED")
    return True


def test_scenario_4():
    """Test manual review scenario."""
    print_header("TEST 4: HIGH RISK - MANUAL REVIEW REQUIRED")
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
    insurer_agent = AdvancedInsurerAgent(config.INSURER_AGENT_ID, blockchain)
    
    doc_processor = DocumentProcessor()
    hospital_bill = doc_processor.extract_bill_data()
    hospital_bill["total_amount"] = 450000
    hospital_bill["has_signature"] = False
    
    documents = [hospital_bill]  # Missing discharge summary
    
    claim_id = "TEST_CLAIM_004"
    patient_agent.submit_claim(claim_id, documents, smart_contract)
    result = insurer_agent.make_decision(claim_id, smart_contract, documents)
    
    assert result["status"] in ["pending_manual_review", "rejected"], "Expected manual review or rejection"
    # Risk score may not be present if rejected early
    if "risk_score" in result:
        assert result["risk_score"] > 0.5, "Expected high risk score"
    
    print("\n✅ TEST 4 PASSED")
    return True


def test_blockchain_integrity():
    """Test blockchain hash integrity."""
    print_header("TEST 5: BLOCKCHAIN INTEGRITY")
    
    blockchain = BlockchainRegistry()
    doc_processor = DocumentProcessor()
    
    # Store document
    doc = {"test": "data", "amount": 1000}
    doc_hash = doc_processor.generate_document_hash(doc)
    blockchain.store_hash("TEST_DOC_001", doc_hash, {"type": "test"})
    
    # Verify correct hash
    assert blockchain.verify_hash("TEST_DOC_001", doc_hash), "Hash verification should pass"
    
    # Verify incorrect hash
    wrong_hash = "0" * 64
    assert not blockchain.verify_hash("TEST_DOC_001", wrong_hash), "Wrong hash should fail"
    
    # Test immutability
    record = blockchain.get_document_record("TEST_DOC_001")
    assert record["immutable"] == True, "Record should be immutable"
    
    print("\n✅ TEST 5 PASSED")
    return True


def test_smart_contract_logic():
    """Test smart contract operations."""
    print_header("TEST 6: SMART CONTRACT LOGIC")
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    # Create claim
    claim = smart_contract.create_claim(
        "TEST_SC_001",
        "patient_001",
        50000,
        ["doc1", "doc2"]
    )
    
    assert claim["status"] == "pending", "New claim should be pending"
    assert claim["amount"] == 50000, "Amount should match"
    
    # Approve and pay
    initial_balance = smart_contract.escrow_balance
    tx = smart_contract.approve_and_pay("TEST_SC_001", "insurer_001")
    
    assert tx["type"] == "payment", "Should be payment transaction"
    assert smart_contract.escrow_balance == initial_balance - 50000, "Escrow should decrease"
    
    # Get claim status
    updated_claim = smart_contract.get_claim_status("TEST_SC_001")
    assert updated_claim["status"] == "paid", "Claim should be paid"
    assert updated_claim["paid_amount"] == 50000, "Paid amount should match"
    
    # Test clawback
    clawback_tx = smart_contract.initiate_clawback(
        "TEST_SC_001",
        "Test clawback",
        25000,
        "audit_001"
    )
    
    assert clawback_tx["type"] == "clawback", "Should be clawback transaction"
    assert smart_contract.escrow_balance == initial_balance - 25000, "Escrow should recover half"
    
    updated_claim = smart_contract.get_claim_status("TEST_SC_001")
    assert updated_claim["status"] == "clawback_initiated", "Status should be clawback_initiated"
    
    print("\n✅ TEST 6 PASSED")
    return True


def main():
    """Run all tests."""
    print("\n" + "="*70)
    print("COMPREHENSIVE SYSTEM TEST SUITE")
    print("="*70)
    print("\nTesting all components:")
    print("• Agent decision-making logic")
    print("• Blockchain hash integrity")
    print("• Smart contract operations")
    print("• Risk assessment algorithms")
    print("• Audit and clawback mechanisms")
    
    tests = [
        ("Low Risk Claim", test_scenario_1),
        ("Medium Risk Claim", test_scenario_2),
        ("Clawback Scenario", test_scenario_3),
        ("Manual Review Required", test_scenario_4),
        ("Blockchain Integrity", test_blockchain_integrity),
        ("Smart Contract Logic", test_smart_contract_logic)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            passed = test_func()
            results.append((test_name, True))
        except AssertionError as e:
            print(f"\n❌ TEST FAILED: {e}")
            results.append((test_name, False))
        except Exception as e:
            print(f"\n❌ TEST ERROR: {e}")
            results.append((test_name, False))
    
    # Summary
    print_header("TEST SUMMARY")
    
    for test_name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    total_passed = sum(1 for _, passed in results if passed)
    print(f"\n{'='*70}")
    print(f"TOTAL: {total_passed}/{len(results)} tests passed")
    print(f"{'='*70}")
    
    if total_passed == len(results):
        print("\n🎉 ALL TESTS PASSED - SYSTEM FULLY FUNCTIONAL")
        return 0
    else:
        print("\n⚠️ SOME TESTS FAILED - REVIEW REQUIRED")
        return 1


if __name__ == "__main__":
    exit(main())
