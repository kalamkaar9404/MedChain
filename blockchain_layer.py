"""Simulated blockchain layer for document hashing and smart contracts."""

import hashlib
import json
from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum


class ClaimStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    PAID = "paid"
    UNDER_REVIEW = "under_review"
    REJECTED = "rejected"
    CLAWBACK_INITIATED = "clawback_initiated"


class BlockchainRegistry:
    """Simulated on-chain registry for document hashes."""
    
    def __init__(self):
        self.registry: Dict[str, Dict] = {}
        self.block_number = 0
    
    def store_hash(self, document_id: str, document_hash: str, metadata: Dict) -> Dict:
        """Store document hash on simulated blockchain."""
        self.block_number += 1
        
        entry = {
            "document_id": document_id,
            "hash": document_hash,
            "metadata": metadata,
            "timestamp": datetime.now().isoformat(),
            "block_number": self.block_number,
            "immutable": True
        }
        
        self.registry[document_id] = entry
        print(f"✓ Hash stored on-chain at block #{self.block_number}")
        return entry
    
    def verify_hash(self, document_id: str, provided_hash: str) -> bool:
        """Verify document hash against registry."""
        if document_id not in self.registry:
            return False
        return self.registry[document_id]["hash"] == provided_hash
    
    def get_document_record(self, document_id: str) -> Optional[Dict]:
        """Retrieve document record from registry."""
        return self.registry.get(document_id)


class SmartContract:
    """Simulated smart contract for claim processing and payments."""
    
    def __init__(self, blockchain_registry: BlockchainRegistry):
        self.blockchain = blockchain_registry
        self.claims: Dict[str, Dict] = {}
        self.transactions: List[Dict] = []
        self.escrow_balance = 10000000  # Simulated insurer escrow in INR
    
    def create_claim(self, claim_id: str, patient_id: str, amount: float, 
                     document_ids: List[str]) -> Dict:
        """Create a new claim on the smart contract."""
        claim = {
            "claim_id": claim_id,
            "patient_id": patient_id,
            "amount": amount,
            "document_ids": document_ids,
            "status": ClaimStatus.PENDING.value,
            "created_at": datetime.now().isoformat(),
            "paid_amount": 0,
            "clawback_amount": 0
        }
        
        self.claims[claim_id] = claim
        print(f"✓ Claim {claim_id} created on smart contract")
        return claim
    
    def approve_and_pay(self, claim_id: str, approver_id: str) -> Dict:
        """Approve claim and execute payment."""
        if claim_id not in self.claims:
            raise ValueError(f"Claim {claim_id} not found")
        
        claim = self.claims[claim_id]
        amount = claim["amount"]
        
        if self.escrow_balance < amount:
            raise ValueError("Insufficient escrow balance")
        
        # Execute payment
        self.escrow_balance -= amount
        claim["status"] = ClaimStatus.PAID.value
        claim["paid_amount"] = amount
        claim["paid_at"] = datetime.now().isoformat()
        claim["approver_id"] = approver_id
        
        # Record transaction
        transaction = {
            "tx_id": f"tx_{len(self.transactions) + 1}",
            "type": "payment",
            "claim_id": claim_id,
            "amount": amount,
            "from": "insurer_escrow",
            "to": claim["patient_id"],
            "timestamp": datetime.now().isoformat()
        }
        self.transactions.append(transaction)
        
        print(f"✓ Payment executed: ₹{amount:,.2f} transferred to {claim['patient_id']}")
        return transaction
    
    def initiate_clawback(self, claim_id: str, reason: str, 
                         clawback_amount: float, auditor_id: str) -> Dict:
        """Initiate clawback mechanism for fraudulent/erroneous claims."""
        if claim_id not in self.claims:
            raise ValueError(f"Claim {claim_id} not found")
        
        claim = self.claims[claim_id]
        
        if claim["status"] != ClaimStatus.PAID.value:
            raise ValueError("Can only clawback paid claims")
        
        # Update claim status
        claim["status"] = ClaimStatus.CLAWBACK_INITIATED.value
        claim["clawback_amount"] = clawback_amount
        claim["clawback_reason"] = reason
        claim["clawback_initiated_at"] = datetime.now().isoformat()
        claim["auditor_id"] = auditor_id
        
        # Record clawback transaction
        transaction = {
            "tx_id": f"tx_{len(self.transactions) + 1}",
            "type": "clawback",
            "claim_id": claim_id,
            "amount": clawback_amount,
            "reason": reason,
            "from": claim["patient_id"],
            "to": "insurer_escrow",
            "timestamp": datetime.now().isoformat()
        }
        self.transactions.append(transaction)
        
        # Simulate clawback execution
        self.escrow_balance += clawback_amount
        
        print(f"⚠ Clawback initiated: ₹{clawback_amount:,.2f} to be recovered")
        print(f"  Reason: {reason}")
        return transaction
    
    def get_claim_status(self, claim_id: str) -> Optional[Dict]:
        """Get current claim status."""
        return self.claims.get(claim_id)
    
    def get_transaction_history(self, claim_id: str = None) -> List[Dict]:
        """Get transaction history."""
        if claim_id:
            return [tx for tx in self.transactions if tx["claim_id"] == claim_id]
        return self.transactions
