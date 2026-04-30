"""
Main demonstration script for Agent-First Healthcare Settlement Platform.

This prototype demonstrates:
1. Straight-Through Processing (Instant Payment)
2. Open Claim & Clawback Scenario
"""

from blockchain_layer import BlockchainRegistry, SmartContract
from document_processor import DocumentProcessor
from agents import PatientAgent, InsurerAgent, AuditAgent
import config
import time


def print_header(title: str):
    """Print formatted section header."""
    print(f"\n\n{'#'*70}")
    print(f"# {title.center(66)} #")
    print(f"{'#'*70}\n")


def print_blockchain_state(blockchain: BlockchainRegistry, smart_contract: SmartContract):
    """Print current blockchain state."""
    print(f"\n{'─'*60}")
    print("BLOCKCHAIN STATE")
    print(f"{'─'*60}")
    print(f"Registry Entries: {len(blockchain.registry)}")
    print(f"Total Claims: {len(smart_contract.claims)}")
    print(f"Total Transactions: {len(smart_contract.transactions)}")
    print(f"Escrow Balance: ₹{smart_contract.escrow_balance:,.2f}")
    print(f"{'─'*60}")


def use_case_1_straight_through_processing():
    """
    Use Case 1: Instant payment for valid claims under threshold.
    """
    print_header("USE CASE 1: STRAIGHT-THROUGH PROCESSING")
    print("Scenario: Patient submits valid hospital bill under auto-approval threshold")
    print("Expected: Instant verification and payment")
    
    # Initialize blockchain infrastructure
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    # Initialize agents
    patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
    insurer_agent = InsurerAgent(config.INSURER_AGENT_ID, blockchain)
    
    # Prepare documents
    doc_processor = DocumentProcessor()
    hospital_bill = doc_processor.extract_bill_data()
    discharge_summary = doc_processor.extract_discharge_summary()
    
    documents = [hospital_bill, discharge_summary]
    
    # Patient submits claim
    claim_id = "CLAIM_001"
    claim = patient_agent.submit_claim(claim_id, documents, smart_contract)
    
    time.sleep(1)  # Simulate processing time
    
    # Insurer verifies and processes
    result = insurer_agent.verify_and_process_claim(
        claim_id, 
        smart_contract, 
        documents
    )
    
    # Show final state
    print_blockchain_state(blockchain, smart_contract)
    
    return blockchain, smart_contract


def use_case_2_clawback_scenario():
    """
    Use Case 2: Claim paid, then audit detects anomaly and initiates clawback.
    """
    print_header("USE CASE 2: OPEN CLAIM & CLAWBACK SCENARIO")
    print("Scenario: Claim initially paid, but audit finds timeline discrepancies")
    print("Expected: Automatic clawback initiation")
    
    # Initialize blockchain infrastructure
    blockchain = BlockchainRegistry()
    smart_contract = SmartContract(blockchain)
    
    # Initialize agents
    patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
    insurer_agent = InsurerAgent(config.INSURER_AGENT_ID, blockchain)
    audit_agent = AuditAgent(config.AUDIT_AGENT_ID, blockchain)
    
    # Prepare initial valid documents
    doc_processor = DocumentProcessor()
    hospital_bill = doc_processor.extract_bill_data()
    discharge_summary = doc_processor.extract_discharge_summary()
    
    documents = [hospital_bill, discharge_summary]
    
    # Patient submits claim
    claim_id = "CLAIM_002"
    claim = patient_agent.submit_claim(claim_id, documents, smart_contract)
    
    time.sleep(1)
    
    # Insurer processes and pays
    result = insurer_agent.verify_and_process_claim(
        claim_id, 
        smart_contract, 
        documents
    )
    
    print(f"\n{'='*60}")
    print("⏰ Time passes... Routine audit scheduled...")
    print(f"{'='*60}")
    time.sleep(2)
    
    # Simulate discovery of anomalous follow-up document
    print("\n📄 Follow-up document submitted for audit...")
    anomalous_doc = doc_processor.create_anomalous_document()
    all_documents = documents + [anomalous_doc]
    
    time.sleep(1)
    
    # Audit agent reviews all documents
    audit_result = audit_agent.audit_claim(
        claim_id,
        smart_contract,
        all_documents
    )
    
    # Show final state
    print_blockchain_state(blockchain, smart_contract)
    
    # Show transaction history
    print(f"\n{'─'*60}")
    print("TRANSACTION HISTORY")
    print(f"{'─'*60}")
    for tx in smart_contract.get_transaction_history(claim_id):
        print(f"\n{tx['type'].upper()}: {tx['tx_id']}")
        print(f"  Amount: ₹{tx['amount']:,.2f}")
        print(f"  Time: {tx['timestamp']}")
        if 'reason' in tx:
            print(f"  Reason: {tx['reason']}")
    print(f"{'─'*60}")
    
    return blockchain, smart_contract


def main():
    """Run both use case demonstrations."""
    print("\n" + "="*70)
    print("AGENT-FIRST HEALTHCARE SETTLEMENT PLATFORM")
    print("Proof of Concept Demonstration")
    print("="*70)
    print("\nThis prototype demonstrates automated insurance settlements using:")
    print("• AI Agents for claim processing")
    print("• Blockchain for document integrity")
    print("• Smart contracts for automated payments")
    print("• Audit agents for fraud detection")
    
    input("\nPress Enter to start Use Case 1...")
    
    # Run Use Case 1
    blockchain1, contract1 = use_case_1_straight_through_processing()
    
    input("\n\nPress Enter to start Use Case 2...")
    
    # Run Use Case 2
    blockchain2, contract2 = use_case_2_clawback_scenario()
    
    print_header("DEMONSTRATION COMPLETE")
    print("✅ Both use cases executed successfully!")
    print("\nKey Takeaways:")
    print("• Use Case 1: Instant settlement for valid claims (< ₹50,000)")
    print("• Use Case 2: Automated fraud detection and clawback mechanism")
    print("• All document hashes stored immutably on blockchain")
    print("• Full audit trail maintained in smart contract")
    print("\nThis prototype is ready for hackathon demonstration!")


if __name__ == "__main__":
    main()
