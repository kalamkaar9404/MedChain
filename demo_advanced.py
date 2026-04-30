"""
Advanced demonstration with intelligent agents showing real decision-making.
"""

from blockchain_layer import BlockchainRegistry, SmartContract
from document_processor import DocumentProcessor
from agents import PatientAgent
from advanced_agents import AdvancedInsurerAgent, AdvancedAuditAgent
import config
import time


def print_header(title: str):
    """Print formatted section header."""
    print(f"\n\n{'#'*70}")
    print(f"# {title.center(66)} #")
    print(f"{'#'*70}\n")


def print_agent_memory(agent):
    """Print agent's decision history."""
    print(f"\n{'─'*60}")
    print(f"AGENT MEMORY: {agent.agent_id}")
    print(f"{'─'*60}")
    state = agent.get_agent_state()
    print(f"Decisions Made: {state['decisions_made']}")
    print(f"Observations: {state['observations']}")
    print(f"\n{state['recent_context']}")
    print(f"{'─'*60}")


def scenario_1_low_risk_claim():
    """Scenario: Low risk claim with instant approval."""
    print_header("SCENARIO 1: LOW RISK - INSTANT APPROVAL")
    print("Setup: Valid documents, low amount, all signatures present")
    print("Expected: Auto-approval with high confidence")
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
    insurer_agent = AdvancedInsurerAgent(config.INSURER_AGENT_ID, blockchain)
    
    # Create low-risk claim
    doc_processor = DocumentProcessor()
    hospital_bill = doc_processor.extract_bill_data()
    hospital_bill["total_amount"] = 25000  # Low amount
    discharge_summary = doc_processor.extract_discharge_summary()
    
    documents = [hospital_bill, discharge_summary]
    
    claim_id = "CLAIM_LOW_RISK_001"
    patient_agent.submit_claim(claim_id, documents, smart_contract)
    
    time.sleep(1)
    
    result = insurer_agent.make_decision(claim_id, smart_contract, documents)
    
    print_agent_memory(insurer_agent)
    
    return blockchain, smart_contract


def scenario_2_medium_risk_claim():
    """Scenario: Medium risk claim requiring monitoring."""
    print_header("SCENARIO 2: MEDIUM RISK - APPROVE WITH MONITORING")
    print("Setup: Valid documents but higher amount, some minor concerns")
    print("Expected: Approval with audit flag")
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
    insurer_agent = AdvancedInsurerAgent(config.INSURER_AGENT_ID, blockchain)
    
    # Create medium-risk claim
    doc_processor = DocumentProcessor()
    hospital_bill = doc_processor.extract_bill_data()
    hospital_bill["total_amount"] = 75000  # Higher amount
    
    # Add cost concentration risk
    hospital_bill["treatment_details"] = [
        {"item": "Surgery", "amount": 50000},  # 66% of total
        {"item": "Room Charges", "amount": 15000},
        {"item": "Medicines", "amount": 10000}
    ]
    
    discharge_summary = doc_processor.extract_discharge_summary()
    
    documents = [hospital_bill, discharge_summary]
    
    claim_id = "CLAIM_MED_RISK_001"
    patient_agent.submit_claim(claim_id, documents, smart_contract)
    
    time.sleep(1)
    
    result = insurer_agent.make_decision(claim_id, smart_contract, documents)
    
    if result.get("audit_required"):
        print(f"\n{'='*60}")
        print("⏰ Triggering routine audit due to risk flag...")
        print(f"{'='*60}")
        time.sleep(2)
        
        audit_agent = AdvancedAuditAgent(config.AUDIT_AGENT_ID, blockchain)
        audit_result = audit_agent.deep_audit(claim_id, smart_contract, documents)
    
    print_agent_memory(insurer_agent)
    
    return blockchain, smart_contract


def scenario_3_high_risk_with_clawback():
    """Scenario: High risk claim that gets paid then clawed back."""
    print_header("SCENARIO 3: HIGH RISK - CLAWBACK AFTER AUDIT")
    print("Setup: Initially approved, but audit finds serious anomalies")
    print("Expected: Clawback with severity-based calculation")
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
    insurer_agent = AdvancedInsurerAgent(config.INSURER_AGENT_ID, blockchain)
    audit_agent = AdvancedAuditAgent(config.AUDIT_AGENT_ID, blockchain)
    
    # Create initially valid claim
    doc_processor = DocumentProcessor()
    hospital_bill = doc_processor.extract_bill_data()
    discharge_summary = doc_processor.extract_discharge_summary()
    
    documents = [hospital_bill, discharge_summary]
    
    claim_id = "CLAIM_HIGH_RISK_001"
    patient_agent.submit_claim(claim_id, documents, smart_contract)
    
    time.sleep(1)
    
    # Initial approval
    result = insurer_agent.make_decision(claim_id, smart_contract, documents)
    
    print(f"\n{'='*60}")
    print("⏰ 48 hours later: Routine audit initiated...")
    print(f"{'='*60}")
    time.sleep(2)
    
    # Add anomalous document
    print("\n📄 Additional document discovered during audit...")
    anomalous_doc = doc_processor.create_anomalous_document()
    all_documents = documents + [anomalous_doc]
    
    time.sleep(1)
    
    # Deep audit
    audit_result = audit_agent.deep_audit(claim_id, smart_contract, all_documents)
    
    print_agent_memory(audit_agent)
    
    return blockchain, smart_contract


def scenario_4_manual_review_required():
    """Scenario: Very high risk requiring human review."""
    print_header("SCENARIO 4: VERY HIGH RISK - MANUAL REVIEW")
    print("Setup: Multiple risk factors, high amount, missing documents")
    print("Expected: Escalation to human underwriter")
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
    insurer_agent = AdvancedInsurerAgent(config.INSURER_AGENT_ID, blockchain)
    
    # Create high-risk claim
    doc_processor = DocumentProcessor()
    hospital_bill = doc_processor.extract_bill_data()
    hospital_bill["total_amount"] = 450000  # Very high amount
    hospital_bill["has_signature"] = False  # Missing signature
    
    # Only one document (missing discharge summary)
    documents = [hospital_bill]
    
    claim_id = "CLAIM_VERY_HIGH_RISK_001"
    patient_agent.submit_claim(claim_id, documents, smart_contract)
    
    time.sleep(1)
    
    result = insurer_agent.make_decision(claim_id, smart_contract, documents)
    
    print_agent_memory(insurer_agent)
    
    return blockchain, smart_contract


def main():
    """Run all advanced scenarios."""
    print("\n" + "="*70)
    print("ADVANCED AGENT DEMONSTRATION")
    print("Intelligent Decision-Making with Reasoning")
    print("="*70)
    print("\nThis demo shows:")
    print("• Risk-based decision making")
    print("• Agent memory and learning")
    print("• Multi-layer audit analysis")
    print("• Severity-based clawback calculations")
    
    scenarios = [
        ("Scenario 1: Low Risk Claim", scenario_1_low_risk_claim),
        ("Scenario 2: Medium Risk Claim", scenario_2_medium_risk_claim),
        ("Scenario 3: High Risk with Clawback", scenario_3_high_risk_with_clawback),
        ("Scenario 4: Manual Review Required", scenario_4_manual_review_required)
    ]
    
    for i, (name, scenario_func) in enumerate(scenarios, 1):
        input(f"\n\nPress Enter to run {name}...")
        scenario_func()
    
    print_header("ALL SCENARIOS COMPLETE")
    print("✅ Demonstrated full range of agent capabilities:")
    print("   • Risk assessment and scoring")
    print("   • Confidence-based decision making")
    print("   • Agent memory and context tracking")
    print("   • Multi-layer audit analysis")
    print("   • Severity-based clawback calculations")
    print("   • Human escalation for edge cases")
    print("\n🚀 Ready for production deployment!")


if __name__ == "__main__":
    main()
