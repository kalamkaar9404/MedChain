"""
Advanced AI Agents with reasoning capabilities using LangChain-style patterns.
This demonstrates true agentic behavior with decision-making logic.
"""

from typing import Dict, List, Optional, Tuple
from datetime import datetime
from blockchain_layer import BlockchainRegistry, SmartContract, ClaimStatus
from document_processor import DocumentProcessor
import config
import json


class AgentMemory:
    """Memory system for agents to track decisions and reasoning."""
    
    def __init__(self):
        self.decisions: List[Dict] = []
        self.observations: List[str] = []
    
    def add_decision(self, decision: str, reasoning: str, confidence: float):
        """Record a decision with reasoning."""
        self.decisions.append({
            "decision": decision,
            "reasoning": reasoning,
            "confidence": confidence,
            "timestamp": datetime.now().isoformat()
        })
    
    def add_observation(self, observation: str):
        """Record an observation."""
        self.observations.append(observation)
    
    def get_context(self) -> str:
        """Get recent context for decision making."""
        recent_decisions = self.decisions[-3:] if len(self.decisions) > 3 else self.decisions
        recent_obs = self.observations[-5:] if len(self.observations) > 5 else self.observations
        
        context = "Recent Observations:\n"
        for obs in recent_obs:
            context += f"- {obs}\n"
        
        context += "\nRecent Decisions:\n"
        for dec in recent_decisions:
            context += f"- {dec['decision']} (confidence: {dec['confidence']:.2f})\n"
        
        return context


class AdvancedInsurerAgent:
    """
    Enhanced Insurer Agent with reasoning capabilities.
    Uses chain-of-thought reasoning for complex decisions.
    """
    
    def __init__(self, agent_id: str, blockchain: BlockchainRegistry):
        self.agent_id = agent_id
        self.blockchain = blockchain
        self.doc_processor = DocumentProcessor()
        self.memory = AgentMemory()
        self.risk_threshold = 0.7
    
    def analyze_claim_risk(self, claim: Dict, documents: List[Dict]) -> Tuple[float, str]:
        """
        Analyze claim risk using multiple factors.
        Returns (risk_score, reasoning)
        """
        risk_factors = []
        risk_score = 0.0
        
        # Factor 1: Amount-based risk
        amount = claim["amount"]
        if amount > config.MAX_CLAIM_AMOUNT * 0.8:
            risk_factors.append(f"High amount (₹{amount:,.2f} near policy limit)")
            risk_score += 0.3
        elif amount > config.AUTO_APPROVAL_THRESHOLD:
            risk_factors.append(f"Amount exceeds auto-approval threshold")
            risk_score += 0.2
        
        # Factor 2: Document completeness
        doc_types = [doc["document_type"] for doc in documents]
        missing_docs = [req for req in config.REQUIRED_DOCUMENTS if req not in doc_types]
        if missing_docs:
            risk_factors.append(f"Missing documents: {', '.join(missing_docs)}")
            risk_score += 0.4
        
        # Factor 3: Signature verification
        unsigned_docs = [doc["document_type"] for doc in documents if not doc.get("has_signature", False)]
        if unsigned_docs:
            risk_factors.append(f"Unsigned documents: {', '.join(unsigned_docs)}")
            risk_score += 0.3
        
        # Factor 4: Timeline analysis
        timeline_risk = self._analyze_timeline_risk(documents)
        if timeline_risk > 0:
            risk_factors.append("Timeline inconsistencies detected")
            risk_score += timeline_risk
        
        # Factor 5: Treatment cost analysis
        cost_risk = self._analyze_cost_reasonableness(documents)
        if cost_risk > 0:
            risk_factors.append("Treatment costs appear unusual")
            risk_score += cost_risk
        
        # Normalize risk score
        risk_score = min(risk_score, 1.0)
        
        reasoning = "Risk Analysis:\n"
        if risk_factors:
            for factor in risk_factors:
                reasoning += f"  • {factor}\n"
        else:
            reasoning += "  • No significant risk factors identified\n"
        
        reasoning += f"\nOverall Risk Score: {risk_score:.2f}/1.00"
        
        return risk_score, reasoning
    
    def _analyze_timeline_risk(self, documents: List[Dict]) -> float:
        """Analyze timeline consistency across documents."""
        dates = []
        for doc in documents:
            if "admission_date" in doc and "discharge_date" in doc:
                try:
                    admission = datetime.fromisoformat(doc["admission_date"])
                    discharge = datetime.fromisoformat(doc["discharge_date"])
                    
                    # Check if discharge is before admission
                    if discharge < admission:
                        return 0.5
                    
                    # Check for unusually long stays
                    stay_days = (discharge - admission).days
                    if stay_days > 30:
                        return 0.2
                    
                    dates.append((admission, discharge))
                except:
                    return 0.1
        
        return 0.0
    
    def _analyze_cost_reasonableness(self, documents: List[Dict]) -> float:
        """Analyze if treatment costs are reasonable."""
        for doc in documents:
            if "treatment_details" in doc:
                total = sum(item["amount"] for item in doc["treatment_details"])
                
                # Check for unusually high individual items
                for item in doc["treatment_details"]:
                    if item["amount"] > total * 0.6:  # Single item > 60% of total
                        return 0.3
        
        return 0.0
    
    def make_decision(self, claim_id: str, smart_contract: SmartContract,
                     original_documents: List[Dict]) -> Dict:
        """
        Make an intelligent decision on claim approval using reasoning.
        """
        print(f"\n{'='*60}")
        print(f"ADVANCED INSURER AGENT: Analyzing Claim {claim_id}")
        print(f"{'='*60}")
        
        # Get claim
        claim = smart_contract.get_claim_status(claim_id)
        if not claim:
            raise ValueError(f"Claim {claim_id} not found")
        
        # Step 1: Hash Verification
        print(f"\n🔍 STEP 1: Cryptographic Verification")
        print("─" * 60)
        
        hash_verification_passed = True
        for i, doc in enumerate(original_documents):
            doc_id = claim["document_ids"][i]
            doc_hash = self.doc_processor.generate_document_hash(doc)
            is_verified = self.blockchain.verify_hash(doc_id, doc_hash)
            
            status = "✓ VERIFIED" if is_verified else "✗ FAILED"
            print(f"  {doc['document_type']}: {status}")
            
            if is_verified:
                self.memory.add_observation(f"Document {doc['document_type']} hash verified")
            else:
                hash_verification_passed = False
                self.memory.add_observation(f"Document {doc['document_type']} hash FAILED")
        
        if not hash_verification_passed:
            reasoning = "Hash verification failed - document integrity compromised"
            self.memory.add_decision("REJECT_CLAIM", reasoning, 1.0)
            print(f"\n❌ DECISION: REJECT")
            print(f"   Reason: {reasoning}")
            return {"status": "rejected", "reason": reasoning}
        
        # Step 2: Risk Analysis
        print(f"\n🔍 STEP 2: Risk Assessment")
        print("─" * 60)
        
        risk_score, risk_reasoning = self.analyze_claim_risk(claim, original_documents)
        print(risk_reasoning)
        
        self.memory.add_observation(f"Risk score calculated: {risk_score:.2f}")
        
        # Step 3: Policy Validation
        print(f"\n🔍 STEP 3: Policy Compliance Check")
        print("─" * 60)
        
        validation_result = self._validate_policy(claim, original_documents)
        if not validation_result["valid"]:
            reasoning = f"Policy violation: {validation_result['reason']}"
            self.memory.add_decision("REJECT_CLAIM", reasoning, 0.95)
            print(f"  ✗ {validation_result['reason']}")
            print(f"\n❌ DECISION: REJECT")
            print(f"   Reason: {reasoning}")
            return {"status": "rejected", "reason": reasoning}
        
        print(f"  ✓ All policy requirements met")
        
        # Step 4: Decision Making
        print(f"\n🤔 STEP 4: Decision Synthesis")
        print("─" * 60)
        
        if risk_score < 0.3:
            # Low risk - auto approve
            decision = "AUTO_APPROVE"
            confidence = 0.95
            reasoning = "Low risk profile, all checks passed, amount within threshold"
            
            print(f"  Risk Level: LOW ({risk_score:.2f})")
            print(f"  Confidence: {confidence:.2%}")
            print(f"  Decision: {decision}")
            
            self.memory.add_decision(decision, reasoning, confidence)
            
            print(f"\n💰 Executing instant payment...")
            transaction = smart_contract.approve_and_pay(claim_id, self.agent_id)
            
            print(f"\n✅ CLAIM APPROVED & PAID")
            print(f"   Transaction ID: {transaction['tx_id']}")
            print(f"   Amount: ₹{transaction['amount']:,.2f}")
            print(f"   Confidence: {confidence:.2%}")
            
            return {
                "status": "approved_and_paid",
                "transaction": transaction,
                "risk_score": risk_score,
                "confidence": confidence,
                "reasoning": reasoning
            }
        
        elif risk_score < self.risk_threshold:
            # Medium risk - approve with monitoring
            decision = "APPROVE_WITH_MONITORING"
            confidence = 0.75
            reasoning = "Moderate risk, approved but flagged for post-payment audit"
            
            print(f"  Risk Level: MEDIUM ({risk_score:.2f})")
            print(f"  Confidence: {confidence:.2%}")
            print(f"  Decision: {decision}")
            
            self.memory.add_decision(decision, reasoning, confidence)
            
            print(f"\n💰 Executing payment with audit flag...")
            transaction = smart_contract.approve_and_pay(claim_id, self.agent_id)
            
            print(f"\n✅ CLAIM APPROVED & PAID (Audit Flagged)")
            print(f"   Transaction ID: {transaction['tx_id']}")
            print(f"   Amount: ₹{transaction['amount']:,.2f}")
            print(f"   ⚠ Flagged for routine audit")
            
            return {
                "status": "approved_with_monitoring",
                "transaction": transaction,
                "risk_score": risk_score,
                "confidence": confidence,
                "reasoning": reasoning,
                "audit_required": True
            }
        
        else:
            # High risk - manual review required
            decision = "REQUIRE_MANUAL_REVIEW"
            confidence = 0.60
            reasoning = f"High risk score ({risk_score:.2f}) requires human review"
            
            print(f"  Risk Level: HIGH ({risk_score:.2f})")
            print(f"  Confidence: {confidence:.2%}")
            print(f"  Decision: {decision}")
            
            self.memory.add_decision(decision, reasoning, confidence)
            
            print(f"\n⏳ MANUAL REVIEW REQUIRED")
            print(f"   Risk factors exceed automated approval threshold")
            print(f"   Claim forwarded to human underwriter")
            
            return {
                "status": "pending_manual_review",
                "risk_score": risk_score,
                "confidence": confidence,
                "reasoning": reasoning
            }
    
    def _validate_policy(self, claim: Dict, documents: List[Dict]) -> Dict:
        """Validate claim against policy rules."""
        if claim["amount"] > config.MAX_CLAIM_AMOUNT:
            return {
                "valid": False,
                "reason": f"Amount exceeds policy limit of ₹{config.MAX_CLAIM_AMOUNT:,}"
            }
        
        doc_types = [doc["document_type"] for doc in documents]
        for required_doc in config.REQUIRED_DOCUMENTS:
            if required_doc not in doc_types:
                return {
                    "valid": False,
                    "reason": f"Missing required document: {required_doc}"
                }
        
        return {"valid": True}
    
    def get_agent_state(self) -> Dict:
        """Get current agent state and memory."""
        return {
            "agent_id": self.agent_id,
            "decisions_made": len(self.memory.decisions),
            "observations": len(self.memory.observations),
            "recent_context": self.memory.get_context()
        }


class AdvancedAuditAgent:
    """
    Enhanced Audit Agent with ML-style anomaly detection patterns.
    """
    
    def __init__(self, agent_id: str, blockchain: BlockchainRegistry):
        self.agent_id = agent_id
        self.blockchain = blockchain
        self.memory = AgentMemory()
        self.anomaly_threshold = 0.6
    
    def deep_audit(self, claim_id: str, smart_contract: SmartContract,
                   all_documents: List[Dict]) -> Dict:
        """
        Perform deep audit with multiple detection strategies.
        """
        print(f"\n{'='*60}")
        print(f"ADVANCED AUDIT AGENT: Deep Analysis of Claim {claim_id}")
        print(f"{'='*60}")
        
        claim = smart_contract.get_claim_status(claim_id)
        if not claim:
            raise ValueError(f"Claim {claim_id} not found")
        
        print(f"\n🔍 Initiating multi-layer audit...")
        print(f"   Documents to analyze: {len(all_documents)}")
        print(f"   Paid amount: ₹{claim['paid_amount']:,.2f}")
        
        anomalies = []
        anomaly_scores = []
        
        # Layer 1: Timeline Analysis
        print(f"\n📅 Layer 1: Timeline Consistency Analysis")
        print("─" * 60)
        timeline_result = self._deep_timeline_analysis(all_documents)
        if timeline_result["anomaly_detected"]:
            anomalies.append(timeline_result)
            anomaly_scores.append(timeline_result["severity"])
            print(f"  ⚠ ANOMALY: {timeline_result['description']}")
            print(f"     Severity: {timeline_result['severity']:.2f}/1.00")
        else:
            print(f"  ✓ Timeline consistency verified")
        
        # Layer 2: Document Authenticity
        print(f"\n📝 Layer 2: Document Authenticity Check")
        print("─" * 60)
        auth_result = self._check_document_authenticity(all_documents)
        if auth_result["anomaly_detected"]:
            anomalies.append(auth_result)
            anomaly_scores.append(auth_result["severity"])
            print(f"  ⚠ ANOMALY: {auth_result['description']}")
            print(f"     Severity: {auth_result['severity']:.2f}/1.00")
        else:
            print(f"  ✓ All documents properly authenticated")
        
        # Layer 3: Cost Pattern Analysis
        print(f"\n💰 Layer 3: Cost Pattern Analysis")
        print("─" * 60)
        cost_result = self._analyze_cost_patterns(all_documents, claim["paid_amount"])
        if cost_result["anomaly_detected"]:
            anomalies.append(cost_result)
            anomaly_scores.append(cost_result["severity"])
            print(f"  ⚠ ANOMALY: {cost_result['description']}")
            print(f"     Severity: {cost_result['severity']:.2f}/1.00")
        else:
            print(f"  ✓ Cost patterns within normal range")
        
        # Decision Making
        if anomalies:
            avg_severity = sum(anomaly_scores) / len(anomaly_scores)
            
            print(f"\n🚨 AUDIT FINDINGS")
            print("─" * 60)
            print(f"  Anomalies Detected: {len(anomalies)}")
            print(f"  Average Severity: {avg_severity:.2f}/1.00")
            
            if avg_severity >= self.anomaly_threshold:
                print(f"\n  ⚡ INITIATING CLAWBACK PROCEDURE")
                
                # Calculate clawback amount based on severity
                clawback_percentage = min(avg_severity, 1.0)
                clawback_amount = claim["paid_amount"] * clawback_percentage
                
                reason = "; ".join([a["description"] for a in anomalies])
                
                transaction = smart_contract.initiate_clawback(
                    claim_id=claim_id,
                    reason=reason,
                    clawback_amount=clawback_amount,
                    auditor_id=self.agent_id
                )
                
                print(f"\n✅ Clawback Executed")
                print(f"   Transaction ID: {transaction['tx_id']}")
                print(f"   Clawback Amount: ₹{clawback_amount:,.2f} ({clawback_percentage:.1%})")
                print(f"   Severity-based calculation: {avg_severity:.2f} × ₹{claim['paid_amount']:,.2f}")
                
                self.memory.add_decision(
                    "CLAWBACK_INITIATED",
                    f"Severity {avg_severity:.2f} exceeds threshold {self.anomaly_threshold}",
                    avg_severity
                )
                
                return {
                    "status": "clawback_initiated",
                    "anomalies": anomalies,
                    "severity": avg_severity,
                    "transaction": transaction
                }
            else:
                print(f"\n  ℹ️ FLAGGED FOR MONITORING")
                print(f"     Severity below clawback threshold ({self.anomaly_threshold})")
                print(f"     Claim remains valid but monitored")
                
                self.memory.add_decision(
                    "FLAG_FOR_MONITORING",
                    f"Minor anomalies detected, severity {avg_severity:.2f}",
                    1 - avg_severity
                )
                
                return {
                    "status": "flagged_for_monitoring",
                    "anomalies": anomalies,
                    "severity": avg_severity
                }
        else:
            print(f"\n✅ AUDIT PASSED")
            print("─" * 60)
            print(f"  No anomalies detected across all layers")
            print(f"  Claim verified as legitimate")
            
            self.memory.add_decision("AUDIT_PASSED", "All checks passed", 0.95)
            
            return {"status": "audit_passed", "anomalies": []}
    
    def _deep_timeline_analysis(self, documents: List[Dict]) -> Dict:
        """Deep timeline analysis with multiple checks."""
        for doc in documents:
            if "admission_date" in doc and "discharge_date" in doc:
                try:
                    admission = datetime.fromisoformat(doc["admission_date"])
                    discharge = datetime.fromisoformat(doc["discharge_date"])
                    
                    # Check 1: Discharge before admission
                    if discharge < admission:
                        return {
                            "anomaly_detected": True,
                            "type": "timeline_impossible",
                            "description": f"Discharge date ({discharge.date()}) before admission ({admission.date()}) in {doc['document_type']}",
                            "severity": 0.9
                        }
                    
                    # Check 2: Unusually long stay
                    stay_days = (discharge - admission).days
                    if stay_days > 60:
                        return {
                            "anomaly_detected": True,
                            "type": "timeline_unusual",
                            "description": f"Unusually long hospital stay ({stay_days} days) in {doc['document_type']}",
                            "severity": 0.5
                        }
                    
                    # Check 3: Future dates
                    if discharge > datetime.now():
                        return {
                            "anomaly_detected": True,
                            "type": "timeline_future",
                            "description": f"Discharge date in future in {doc['document_type']}",
                            "severity": 0.95
                        }
                except:
                    pass
        
        return {"anomaly_detected": False}
    
    def _check_document_authenticity(self, documents: List[Dict]) -> Dict:
        """Check document authenticity markers."""
        for doc in documents:
            # Check signatures
            if not doc.get("has_signature", False):
                return {
                    "anomaly_detected": True,
                    "type": "missing_signature",
                    "description": f"Missing authorized signature on {doc['document_type']}",
                    "severity": 0.7
                }
            
            # Check stamps (for bills)
            if doc["document_type"] == "hospital_bill" and not doc.get("has_stamp", False):
                return {
                    "anomaly_detected": True,
                    "type": "missing_stamp",
                    "description": f"Missing hospital stamp on {doc['document_type']}",
                    "severity": 0.6
                }
        
        return {"anomaly_detected": False}
    
    def _analyze_cost_patterns(self, documents: List[Dict], paid_amount: float) -> Dict:
        """Analyze cost patterns for anomalies."""
        for doc in documents:
            if "treatment_details" in doc:
                total = sum(item["amount"] for item in doc["treatment_details"])
                
                # Check for single item dominating cost
                for item in doc["treatment_details"]:
                    if item["amount"] > total * 0.7:
                        return {
                            "anomaly_detected": True,
                            "type": "cost_concentration",
                            "description": f"Single item '{item['item']}' represents {item['amount']/total:.1%} of total cost",
                            "severity": 0.5
                        }
        
        return {"anomaly_detected": False}
