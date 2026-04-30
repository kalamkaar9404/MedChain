"""Document processing and hash generation for medical documents."""

import hashlib
import json
from typing import Dict, List
from datetime import datetime, timedelta
import random


class DocumentProcessor:
    """Process medical documents and extract key information."""
    
    @staticmethod
    def generate_document_hash(document_data: Dict) -> str:
        """Generate cryptographic hash of document."""
        # Serialize document data
        doc_string = json.dumps(document_data, sort_keys=True)
        
        # Generate SHA-256 hash
        hash_object = hashlib.sha256(doc_string.encode())
        return hash_object.hexdigest()
    
    @staticmethod
    def extract_bill_data(pdf_path: str = None) -> Dict:
        """
        Simulate extraction of data from hospital bill PDF.
        In production, this would use OCR/AI models.
        """
        # Simulated extraction
        admission_date = datetime.now() - timedelta(days=5)
        discharge_date = datetime.now() - timedelta(days=1)
        
        return {
            "document_type": "hospital_bill",
            "hospital_name": "Apollo Hospitals",
            "hospital_id": "HOSP_APL_001",
            "patient_name": "[PATIENT_NAME]",
            "patient_id": "PAT_001",
            "admission_date": admission_date.isoformat(),
            "discharge_date": discharge_date.isoformat(),
            "total_amount": 45000.00,
            "treatment_details": [
                {"item": "Room Charges", "amount": 15000},
                {"item": "Doctor Consultation", "amount": 5000},
                {"item": "Medicines", "amount": 12000},
                {"item": "Lab Tests", "amount": 8000},
                {"item": "Procedures", "amount": 5000}
            ],
            "has_stamp": True,
            "has_signature": True,
            "authorized_signatory": "Dr. [DOCTOR_NAME]"
        }
    
    @staticmethod
    def extract_discharge_summary(pdf_path: str = None) -> Dict:
        """
        Simulate extraction of discharge summary.
        In production, this would use medical NLP models.
        """
        admission_date = datetime.now() - timedelta(days=5)
        discharge_date = datetime.now() - timedelta(days=1)
        
        return {
            "document_type": "discharge_summary",
            "hospital_name": "Apollo Hospitals",
            "patient_name": "[PATIENT_NAME]",
            "patient_id": "PAT_001",
            "admission_date": admission_date.isoformat(),
            "discharge_date": discharge_date.isoformat(),
            "diagnosis": "Acute Appendicitis",
            "procedures": ["Appendectomy"],
            "medications": ["Antibiotics", "Pain Management"],
            "follow_up_required": True,
            "has_signature": True,
            "authorized_doctor": "Dr. [DOCTOR_NAME]"
        }
    
    @staticmethod
    def create_anomalous_document() -> Dict:
        """Create a document with timeline discrepancies for testing."""
        # Intentional discrepancy: discharge before admission
        admission_date = datetime.now() - timedelta(days=3)
        discharge_date = datetime.now() - timedelta(days=10)  # Anomaly!
        
        return {
            "document_type": "follow_up_bill",
            "hospital_name": "Apollo Hospitals",
            "patient_id": "PAT_001",
            "admission_date": admission_date.isoformat(),
            "discharge_date": discharge_date.isoformat(),
            "amount": 5000.00,
            "has_stamp": True,
            "has_signature": False,  # Missing signature - another anomaly
            "authorized_signatory": None
        }
