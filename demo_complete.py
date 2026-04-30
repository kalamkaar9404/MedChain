"""
Complete demonstration showing all features of the platform.
This is the ultimate showcase for hackathons and presentations.
"""

from blockchain_layer import BlockchainRegistry, SmartContract
from document_processor import DocumentProcessor
from agents import PatientAgent
from advanced_agents import AdvancedInsurerAgent, AdvancedAuditAgent
import config
import time
import json


def print_banner():
    """Print welcome banner."""
    print("\n" + "="*70)
    print("╔═══════════════════════════════════════════════════════════════════╗")
    print("║                                                                   ║")
    print("║        AGENT-FIRST HEALTHCARE SETTLEMENT PLATFORM                ║")
    print("║        Complete Feature Demonstration                            ║")
    print("║                                                                   ║")
    print("╚═══════════════════════════════════════════════════════════════════╝")
    print("="*70)


def print_section(title: str, description: str = ""):
    """Print section header."""
    print(f"\n\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}")
    if description:
        print(f"  {description}")
        print(f"{'─'*70}")


def print_stats(blockchain: BlockchainRegistry, smart_contract: SmartContract):
    """Print current system statistics."""
    print(f"\n{'┌'+ '─'*68 + '┐'}")
    print(f"│ {'SYSTEM STATISTICS'.center(66)} │")
    print(f"├{'─'*68}┤")
    print(f"│ Blockchain Blocks: {str(blockchain.block_number).ljust(49)} │")
    print(f"│ Registry Entries: {str(len(blockchain.registry)).ljust(50)} │")
    print(f"│ Total Claims: {str(len(smart_contract.claims)).ljust(54)} │")
    print(f"│ Total Transactions: {str(len(smart_contract.transactions)).ljust(48)} │")
    print(f"│ Escrow Balance: ₹{smart_contract.escrow_balance:,.2f}".ljust(69) + "│")
    print(f"└{'─'*68}┘")


def demo_feature_1_document_hashing():
    """Feature 1: Cryptographic document hashing."""
    print_section(
        "FEATURE 1: CRYPTOGRAPHIC DOCUMENT HASHING",
        "Demonstrating immutable document storage with SHA-256"
    )
    
    doc_processor = DocumentProcessor()
    blockchain = BlockchainRegistry()
    
    # Create sample document
    sample_doc = {
        "document_type": "hospital_bill",
        "patient_id": "PAT_001",
        "amount": 50000,
        "hospital": "Apollo Hospitals"
    }
    
    print("\n📄 Original Document:")
    print(json.dumps(sample_doc, indent=2))
    
    # Generate hash
    doc_hash = doc_processor.generate_document_hash(sample_doc)
    print(f"\n🔐 Generated SHA-256 Hash:")
    print(f"   {doc_hash}")
    
    # Store on blockchain
    blockchain.store_hash("DEMO_DOC_001", doc_hash, {"type": "demo"})
    
    # Verify
    print(f"\n✓ Verification Test:")
    is_valid = blockchain.verify_hash("DEMO_DOC_001", doc_hash)
    print(f"   Original document: {'✓ VERIFIED' if is_valid else '✗ FAILED'}")
    
    # Test tampering
    sample_doc["amount"] = 60000  # Tamper with amount
    tampered_hash = doc_processor.generate_document_hash(sample_doc)
    is_valid_tampered = blockchain.verify_hash("DEMO_DOC_001", tampered_hash)
    print(f"   Tampered document: {'✓ VERIFIED' if is_valid_tampered else '✗ FAILED (as expected)'}")
    
    print(f"\n💡 Key Insight: Any modification to the document changes the hash,")
    print(f"   making tampering immediately detectable.")
    
    return blockchain


def demo_feature_2_risk_assessment():
    """Feature 2: AI-powered risk assessment."""
    print_section(
        "FEATURE 2: AI-POWERED RISK ASSESSMENT",
        "Intelligent agents evaluate claims using multiple risk factors"
    )
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    insurer_agent = AdvancedInsurerAgent(config.INSURER_AGENT_ID, blockchain)
    
    # Test different risk scenarios
    scenarios = [
        {
            "name": "Low Risk",
            "amount": 25000,
            "has_signature": True,
            "documents": ["hospital_bill", "discharge_summary"],
            "expected_risk": "< 0.3"
        },
        {
            "name": "Medium Risk",
            "amount": 75000,
            "has_signature": True,
            "documents": ["hospital_bill", "discharge_summary"],
            "expected_risk": "0.3 - 0.7"
        },
        {
            "name": "High Risk",
            "amount": 450000,
            "has_signature": False,
            "documents": ["hospital_bill"],
            "expected_risk": "> 0.7"
        }
    ]
    
    print("\n📊 Risk Assessment Matrix:\n")
    print(f"{'Scenario':<15} {'Amount':<15} {'Signature':<12} {'Docs':<6} {'Risk Score':<12} {'Decision'}")
    print("─" * 80)
    
    for scenario in scenarios:
        doc_processor = DocumentProcessor()
        hospital_bill = doc_processor.extract_bill_data()
        hospital_bill["total_amount"] = scenario["amount"]
        hospital_bill["has_signature"] = scenario["has_signature"]
        
        documents = [hospital_bill]
        if "discharge_summary" in scenario["documents"]:
            documents.append(doc_processor.extract_discharge_summary())
        
        # Create claim
        claim_id = f"RISK_TEST_{scenario['name'].replace(' ', '_')}"
        patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
        patient_agent.submit_claim(claim_id, documents, smart_contract)
        
        # Assess risk
        result = insurer_agent.make_decision(claim_id, smart_contract, documents)
        
        risk_score = result.get("risk_score", "N/A")
        status = result["status"]
        
        print(f"{scenario['name']:<15} ₹{scenario['amount']:<13,} {'Yes' if scenario['has_signature'] else 'No':<12} "
              f"{len(scenario['documents']):<6} {risk_score if isinstance(risk_score, str) else f'{risk_score:.2f}':<12} {status}")
    
    print("\n💡 Key Insight: Risk scores drive automated decision-making,")
    print("   balancing speed with fraud prevention.")
    
    return blockchain, smart_contract


def demo_feature_3_straight_through_processing():
    """Feature 3: Instant payment processing."""
    print_section(
        "FEATURE 3: STRAIGHT-THROUGH PROCESSING",
        "Instant settlements for low-risk claims"
    )
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
    insurer_agent = AdvancedInsurerAgent(config.INSURER_AGENT_ID, blockchain)
    
    doc_processor = DocumentProcessor()
    hospital_bill = doc_processor.extract_bill_data()
    hospital_bill["total_amount"] = 35000  # Under threshold
    discharge_summary = doc_processor.extract_discharge_summary()
    
    documents = [hospital_bill, discharge_summary]
    
    print("\n⏱️  Processing Timeline:\n")
    
    start_time = time.time()
    
    # Submit
    print("   [0.0s] Patient submits claim...")
    patient_agent.submit_claim("STP_DEMO_001", documents, smart_contract)
    submit_time = time.time() - start_time
    
    # Verify and pay
    print(f"   [{submit_time:.1f}s] Insurer agent verifying...")
    result = insurer_agent.make_decision("STP_DEMO_001", smart_contract, documents)
    total_time = time.time() - start_time
    
    print(f"   [{total_time:.1f}s] ✅ Payment approved and executed!")
    
    print(f"\n💰 Settlement Details:")
    print(f"   Amount: ₹{hospital_bill['total_amount']:,.2f}")
    print(f"   Processing Time: {total_time:.2f} seconds")
    print(f"   Status: {result['status']}")
    print(f"   Confidence: {result['confidence']:.1%}")
    
    print(f"\n💡 Key Insight: Traditional insurance claims take 7-30 days.")
    print(f"   This system settles in seconds for valid claims.")
    
    return blockchain, smart_contract


def demo_feature_4_multi_layer_audit():
    """Feature 4: Multi-layer fraud detection."""
    print_section(
        "FEATURE 4: MULTI-LAYER FRAUD DETECTION",
        "Automated audit with anomaly detection"
    )
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
    insurer_agent = AdvancedInsurerAgent(config.INSURER_AGENT_ID, blockchain)
    audit_agent = AdvancedAuditAgent(config.AUDIT_AGENT_ID, blockchain)
    
    # Initial valid claim
    doc_processor = DocumentProcessor()
    hospital_bill = doc_processor.extract_bill_data()
    discharge_summary = doc_processor.extract_discharge_summary()
    
    documents = [hospital_bill, discharge_summary]
    
    print("\n📋 Phase 1: Initial Claim Processing")
    patient_agent.submit_claim("AUDIT_DEMO_001", documents, smart_contract)
    result = insurer_agent.make_decision("AUDIT_DEMO_001", smart_contract, documents)
    print(f"   ✓ Claim approved: ₹{hospital_bill['total_amount']:,.2f}")
    
    print("\n🔍 Phase 2: Post-Payment Audit")
    print("   Analyzing documents across multiple layers...")
    
    # Add anomalous document
    anomalous_doc = doc_processor.create_anomalous_document()
    all_documents = documents + [anomalous_doc]
    
    audit_result = audit_agent.deep_audit("AUDIT_DEMO_001", smart_contract, all_documents)
    
    if audit_result["status"] == "clawback_initiated":
        print(f"\n⚠️  Audit Results:")
        print(f"   Anomalies Detected: {len(audit_result['anomalies'])}")
        print(f"   Severity Score: {audit_result['severity']:.2f}/1.00")
        print(f"   Clawback Amount: ₹{audit_result['transaction']['amount']:,.2f}")
        
        print(f"\n📊 Detected Anomalies:")
        for anomaly in audit_result["anomalies"]:
            print(f"   • {anomaly['description']}")
            print(f"     Severity: {anomaly['severity']:.2f}/1.00")
    
    print(f"\n💡 Key Insight: Automated audits catch fraud that humans might miss,")
    print(f"   with severity-based clawback calculations.")
    
    return blockchain, smart_contract


def demo_feature_5_agent_memory():
    """Feature 5: Agent memory and learning."""
    print_section(
        "FEATURE 5: AGENT MEMORY & LEARNING",
        "Agents track decisions and build context"
    )
    
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    insurer_agent = AdvancedInsurerAgent(config.INSURER_AGENT_ID, blockchain)
    
    # Process multiple claims
    print("\n🧠 Processing multiple claims to build agent memory...\n")
    
    for i in range(3):
        doc_processor = DocumentProcessor()
        hospital_bill = doc_processor.extract_bill_data()
        hospital_bill["total_amount"] = 30000 + (i * 10000)
        discharge_summary = doc_processor.extract_discharge_summary()
        
        documents = [hospital_bill, discharge_summary]
        
        claim_id = f"MEMORY_DEMO_{i+1:03d}"
        patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
        patient_agent.submit_claim(claim_id, documents, smart_contract)
        result = insurer_agent.make_decision(claim_id, smart_contract, documents)
        
        print(f"   Claim {i+1}: ₹{hospital_bill['total_amount']:,} → {result['status']}")
    
    # Show agent state
    print(f"\n📊 Agent Memory State:")
    state = insurer_agent.get_agent_state()
    print(f"   Total Decisions: {state['decisions_made']}")
    print(f"   Total Observations: {state['observations']}")
    
    print(f"\n📝 Recent Context:")
    context_lines = state['recent_context'].split('\n')
    for line in context_lines[:10]:  # Show first 10 lines
        if line.strip():
            print(f"   {line}")
    
    print(f"\n💡 Key Insight: Agents maintain context across claims,")
    print(f"   enabling pattern recognition and improved decision-making.")
    
    return blockchain, smart_contract


def main():
    """Run complete demonstration."""
    print_banner()
    
    print("\n🎯 This demonstration showcases:")
    print("   1. Cryptographic document hashing")
    print("   2. AI-powered risk assessment")
    print("   3. Straight-through processing")
    print("   4. Multi-layer fraud detection")
    print("   5. Agent memory and learning")
    
    input("\n\nPress Enter to begin the demonstration...")
    
    # Feature 1
    blockchain1 = demo_feature_1_document_hashing()
    input("\n\nPress Enter to continue to Feature 2...")
    
    # Feature 2
    blockchain2, contract2 = demo_feature_2_risk_assessment()
    input("\n\nPress Enter to continue to Feature 3...")
    
    # Feature 3
    blockchain3, contract3 = demo_feature_3_straight_through_processing()
    input("\n\nPress Enter to continue to Feature 4...")
    
    # Feature 4
    blockchain4, contract4 = demo_feature_4_multi_layer_audit()
    input("\n\nPress Enter to continue to Feature 5...")
    
    # Feature 5
    blockchain5, contract5 = demo_feature_5_agent_memory()
    
    # Final summary
    print_section("DEMONSTRATION COMPLETE", "")
    
    print("\n✅ All Features Demonstrated Successfully!\n")
    
    print("📊 Final System State:")
    print_stats(blockchain5, contract5)
    
    print("\n🎯 Key Achievements:")
    print("   ✓ Cryptographic integrity with SHA-256 hashing")
    print("   ✓ Intelligent risk-based decision making")
    print("   ✓ Sub-second claim settlements")
    print("   ✓ Automated fraud detection and clawback")
    print("   ✓ Agent memory and context tracking")
    
    print("\n🚀 Next Steps:")
    print("   • Deploy to production blockchain (Polygon/Ethereum)")
    print("   • Integrate real OCR/AI for document processing")
    print("   • Connect to hospital EMR systems")
    print("   • Add regulatory compliance reporting")
    
    print("\n" + "="*70)
    print("Thank you for exploring the Agent-First Healthcare Platform!")
    print("="*70 + "\n")


if __name__ == "__main__":
    main()
