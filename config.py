"""Configuration for the healthcare settlement platform."""

# Blockchain simulation settings
BLOCKCHAIN_NETWORK = "simulated"
GAS_LIMIT = 3000000

# Agent settings
PATIENT_AGENT_ID = "patient_001"
INSURER_AGENT_ID = "insurer_001"
AUDIT_AGENT_ID = "audit_001"

# Policy rules
MAX_CLAIM_AMOUNT = 500000  # INR
AUTO_APPROVAL_THRESHOLD = 50000  # INR
REQUIRED_DOCUMENTS = ["hospital_bill", "discharge_summary"]

# Audit thresholds
TIMELINE_DISCREPANCY_DAYS = 7
SIGNATURE_VERIFICATION_REQUIRED = True
