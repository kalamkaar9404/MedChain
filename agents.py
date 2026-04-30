"""AI Agents for healthcare claim processing."""

from typing import Dict, List, Optional
from datetime import datetime
from blockchain_layer import BlockchainRegistry, SmartContract, ClaimStatus
from document_processor import DocumentProcessor
import config


class PatientAgent:
    """Agent representing the patient/family submitting claims."""
    
    def __init__(self, agent_id: str, blockchain: BlockchainRegistry):
        self.agent_id = agent_id
        self.blockchain = blockchain
        self.doc_processor = DocumentProcessor()
    
    def submit_claim(self, claim_id: str, documents: List[Dict], 
                     smart_contract: SmartContract) -> Dict:
        """Submit a claim with medical documents."""
        print(f"\n{'='*60}")
        print(f"PATIENT AGENT: Submitting Claim {claim_id}")
        print(f"{'='*60}")
        
        # Process and hash each document
        document_ids = []
        total_amount = 0
        
        for doc in documents:
            # Generate hash
            doc_hash = self.doc_processor.generate_document_hash(doc)
            doc_id = f"{claim_id}_{doc['document_type']}"
            
            # Store hash on blockchain
            print(f"\n📄 Processing {doc['document_type']}...")
            self.blockchain.store_hash(
                document_id=doc_id,
                document_hash=doc_hash,
                metadata={
                    "document_type": doc["document_type"],
                    "patient_id": self.agent_id,
                    "claim_id": claim_id
                }
            )
            
            document_ids.append(doc_id)
            
            # Calculate total amount
            if "total_amount" in doc:
                total_amount += doc["total_amount"]
            elif "amount" in doc:
                total_amount += doc["amount"]
        
        # Create claim on smart contract
        print(f"\n💼 Creating claim on smart contract...")
        claim = smart_contract.create_claim(
            claim_id=claim_id,
            patient_id=self.agent_id,
            amount=total_amount,
            document_ids=document_ids
        )
        
        print(f"\n✅ Claim submitted successfully!")
        print(f"   Total Amount: ₹{total_amount:,.2f}")
        print(f"   Documents: {len(document_ids)}")
        
        return claim


class InsurerAgent:
    """Agent representing the insurance company for claim verification."""
    
    def __init__(self, agent_id: str, blockchain: BlockchainRegistry):
        self.agent_id = agent_id
        self.blockchain = blockchain
        self.doc_processor = DocumentProcessor()
    
    def verify_and_process_claim(self, claim_id: str, 
                                  smart_contract: SmartContract,
                                  original_documents: List[Dict]) -> Dict:
        """Verify claim authenticity and process payment."""
        print(f"\n{'='*60}")
        print(f"INSURER AGENT: Verifying Claim {claim_id}")
        print(f"{'='*60}")
        
        # Get claim from smart contract
        claim = smart_contract.get_claim_status(claim_id)
        if not claim:
            raise ValueError(f"Claim {claim_id} not found")
        
        print(f"\n🔍 Step 1: Verifying document hashes...")
        
        # Verify each document hash
        all_verified = True
        for i, doc in enumerate(original_documents):
            doc_id = claim["document_ids"][i]
            doc_hash = self.doc_processor.generate_document_hash(doc)
            
            is_verified = self.blockchain.verify_hash(doc_id, doc_hash)
            status = "✓ VERIFIED" if is_verified else "✗ FAILED"
            print(f"   {doc['document_type']}: {status}")
            
            if not is_verified:
                all_verified = False
        
        if not all_verified:
            print("\n❌ Hash verification failed. Claim rejected.")
            return {"status": "rejected", "reason": "Hash verification failed"}
        
        # Policy validation
        print(f"\n🔍 Step 2: Validating against policy rules...")
        validation_result = self._validate_policy(claim, original_documents)
        
        if not validation_result["valid"]:
            print(f"\n❌ Policy validation failed: {validation_result['reason']}")
            return {"status": "rejected", "reason": validation_result["reason"]}
        
        print("   ✓ Policy validation passed")
        
        # Check for auto-approval
        if claim["amount"] <= config.AUTO_APPROVAL_THRESHOLD:
            print(f"\n💰 Step 3: Auto-approval threshold met (≤₹{config.AUTO_APPROVAL_THRESHOLD:,})")
            print("   Executing instant payment...")
            
            transaction = smart_contract.approve_and_pay(claim_id, self.agent_id)
            
            print(f"\n✅ CLAIM APPROVED & PAID")
            print(f"   Transaction ID: {transaction['tx_id']}")
            print(f"   Amount: ₹{transaction['amount']:,.2f}")
            
            return {
                "status": "approved_and_paid",
                "transaction": transaction,
                "processing_time": "instant"
            }
        else:
            print(f"\n⏳ Amount exceeds auto-approval threshold")
            print("   Manual review required")
            return {"status": "pending_review", "reason": "Amount exceeds threshold"}
    
    def _validate_policy(self, claim: Dict, documents: List[Dict]) -> Dict:
        """Validate claim against policy rules."""
        # Check amount limits
        if claim["amount"] > config.MAX_CLAIM_AMOUNT:
            return {
                "valid": False,
                "reason": f"Amount exceeds policy limit of ₹{config.MAX_CLAIM_AMOUNT:,}"
            }
        
        # Check required documents
        doc_types = [doc["document_type"] for doc in documents]
        for required_doc in config.REQUIRED_DOCUMENTS:
            if required_doc not in doc_types:
                return {
                    "valid": False,
                    "reason": f"Missing required document: {required_doc}"
                }
        
        # Check signatures and stamps
        for doc in documents:
            if config.SIGNATURE_VERIFICATION_REQUIRED:
                if not doc.get("has_signature", False):
                    return {
                        "valid": False,
                        "reason": f"Missing signature on {doc['document_type']}"
                    }
        
        return {"valid": True}


class AuditAgent:
    """Agent for post-payment auditing and fraud detection."""
    
    def __init__(self, agent_id: str, blockchain: BlockchainRegistry):
        self.agent_id = agent_id
        self.blockchain = blockchain
    
    def audit_claim(self, claim_id: str, smart_contract: SmartContract,
                    all_documents: List[Dict]) -> Dict:
        """Audit a paid claim for anomalies."""
        print(f"\n{'='*60}")
        print(f"AUDIT AGENT: Auditing Claim {claim_id}")
        print(f"{'='*60}")
        
        claim = smart_contract.get_claim_status(claim_id)
        if not claim:
            raise ValueError(f"Claim {claim_id} not found")
        
        print(f"\n🔍 Analyzing {len(all_documents)} documents for anomalies...")
        
        anomalies = []
        
        # Check timeline consistency
        timeline_check = self._check_timeline_consistency(all_documents)
        if not timeline_check["valid"]:
            anomalies.append(timeline_check)
            print(f"   ⚠ Timeline Anomaly: {timeline_check['description']}")
        
        # Check signature consistency
        signature_check = self._check_signatures(all_documents)
        if not signature_check["valid"]:
            anomalies.append(signature_check)
            print(f"   ⚠ Signature Anomaly: {signature_check['description']}")
        
        if anomalies:
            print(f"\n🚨 ANOMALIES DETECTED: {len(anomalies)} issue(s) found")
            print("   Initiating clawback procedure...")
            
            # Calculate clawback amount (could be partial or full)
            clawback_amount = claim["paid_amount"] * 0.5  # 50% clawback for demo
            
            reason = "; ".join([a["description"] for a in anomalies])
            
            transaction = smart_contract.initiate_clawback(
                claim_id=claim_id,
                reason=reason,
                clawback_amount=clawback_amount,
                auditor_id=self.agent_id
            )
            
            print(f"\n✅ Clawback initiated")
            print(f"   Transaction ID: {transaction['tx_id']}")
            print(f"   Clawback Amount: ₹{clawback_amount:,.2f}")
            
            return {
                "status": "clawback_initiated",
                "anomalies": anomalies,
                "transaction": transaction
            }
        else:
            print(f"\n✅ No anomalies detected. Claim is valid.")
            return {"status": "audit_passed", "anomalies": []}
    
    def _check_timeline_consistency(self, documents: List[Dict]) -> Dict:
        """Check for timeline discrepancies across documents."""
        dates = []
        for doc in documents:
            if "admission_date" in doc and "discharge_date" in doc:
                admission = datetime.fromisoformat(doc["admission_date"])
                discharge = datetime.fromisoformat(doc["discharge_date"])
                
                # Check if discharge is before admission
                if discharge < admission:
                    return {
                        "valid": False,
                        "type": "timeline_discrepancy",
                        "description": f"Discharge date before admission date in {doc['document_type']}"
                    }
                
                dates.append((admission, discharge))
        
        # Check consistency across documents
        if len(dates) > 1:
            base_admission, base_discharge = dates[0]
            for admission, discharge in dates[1:]:
                day_diff = abs((admission - base_admission).days)
                if day_diff > config.TIMELINE_DISCREPANCY_DAYS:
                    return {
                        "valid": False,
                        "type": "timeline_discrepancy",
                        "description": f"Admission dates differ by {day_diff} days across documents"
                    }
        
        return {"valid": True}
    
    def _check_signatures(self, documents: List[Dict]) -> Dict:
        """Check for missing or inconsistent signatures."""
        for doc in documents:
            if not doc.get("has_signature", False):
                return {
                    "valid": False,
                    "type": "missing_signature",
                    "description": f"Missing authorized signature on {doc['document_type']}"
                }
        
        return {"valid": True}
