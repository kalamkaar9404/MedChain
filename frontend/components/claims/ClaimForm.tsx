'use client'

import { useState } from 'react'
import { useSubmitClaim } from '@/hooks/useClaims'
import { DocumentType } from '@/lib/types'
import { DOCUMENT_TYPE_LABELS, VALIDATION_RULES } from '@/lib/constants'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'

export function ClaimForm() {
  const { submit, loading, error, success } = useSubmitClaim()
  const [formData, setFormData] = useState({
    patient_id: '',
    amount: '',
    reason: '',
    admission_date: '',
    discharge_date: '',
    document_type: DocumentType.MEDICAL_INVOICE,
    signature_verified: false,
    stamp_verified: false,
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.patient_id || formData.patient_id.length < VALIDATION_RULES.PATIENT_ID_MIN) {
      errors.patient_id = 'Patient ID is required'
    }
    if (!formData.amount || parseFloat(formData.amount) < VALIDATION_RULES.AMOUNT_MIN) {
      errors.amount = 'Amount must be greater than 0'
    }
    if (parseFloat(formData.amount) > VALIDATION_RULES.AMOUNT_MAX) {
      errors.amount = `Amount cannot exceed $${VALIDATION_RULES.AMOUNT_MAX}`
    }
    if (!formData.reason || formData.reason.length < VALIDATION_RULES.REASON_MIN) {
      errors.reason = 'Reason must be at least 10 characters'
    }
    if (!formData.admission_date) {
      errors.admission_date = 'Admission date is required'
    }
    if (!formData.discharge_date) {
      errors.discharge_date = 'Discharge date is required'
    }
    if (formData.admission_date && formData.discharge_date) {
      const admission = new Date(formData.admission_date)
      const discharge = new Date(formData.discharge_date)
      if (discharge <= admission) {
        errors.discharge_date = 'Discharge date must be after admission date'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const payload = {
      patient_id: formData.patient_id,
      amount: parseFloat(formData.amount),
      reason: formData.reason,
      admission_date: formData.admission_date,
      discharge_date: formData.discharge_date,
      document_hashes: ['hash_' + Math.random().toString(36).substr(2, 9)],
      document_types: [formData.document_type],
      signature_verified: formData.signature_verified,
      stamp_verified: formData.stamp_verified,
    }

    await submit(payload)
  }

  if (success) {
    return (
      <div className='bg-green-50 border border-green-200 rounded-lg p-6 flex items-start gap-4'>
        <CheckCircle className='w-6 h-6 text-green-600 flex-shrink-0 mt-0.5' />
        <div>
          <h3 className='font-semibold text-green-900'>Claim Submitted Successfully!</h3>
          <p className='text-green-800 text-sm mt-1'>Your claim has been submitted for verification.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='bg-white rounded-lg shadow-lg p-8 border border-gray-100'>
      <h2 className='text-2xl font-bold text-slate-900 mb-6'>Submit New Claim</h2>

      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3'>
          <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
          <p className='text-red-800 text-sm'>{error}</p>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Patient ID */}
        <div>
          <label className='block text-sm font-medium text-slate-900 mb-2'>Patient ID *</label>
          <input
            type='text'
            value={formData.patient_id}
            onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.patient_id ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder='Enter your patient ID'
          />
          {validationErrors.patient_id && (
            <p className='text-red-600 text-sm mt-1'>{validationErrors.patient_id}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className='block text-sm font-medium text-slate-900 mb-2'>Claim Amount (USD) *</label>
          <input
            type='number'
            step='0.01'
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.amount ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder='Enter claim amount'
          />
          {validationErrors.amount && <p className='text-red-600 text-sm mt-1'>{validationErrors.amount}</p>}
        </div>

        {/* Admission Date */}
        <div>
          <label className='block text-sm font-medium text-slate-900 mb-2'>Admission Date *</label>
          <input
            type='date'
            value={formData.admission_date}
            onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.admission_date ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {validationErrors.admission_date && (
            <p className='text-red-600 text-sm mt-1'>{validationErrors.admission_date}</p>
          )}
        </div>

        {/* Discharge Date */}
        <div>
          <label className='block text-sm font-medium text-slate-900 mb-2'>Discharge Date *</label>
          <input
            type='date'
            value={formData.discharge_date}
            onChange={(e) => setFormData({ ...formData, discharge_date: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.discharge_date ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {validationErrors.discharge_date && (
            <p className='text-red-600 text-sm mt-1'>{validationErrors.discharge_date}</p>
          )}
        </div>

        {/* Document Type */}
        <div>
          <label className='block text-sm font-medium text-slate-900 mb-2'>Document Type *</label>
          <select
            value={formData.document_type}
            onChange={(e) => setFormData({ ...formData, document_type: e.target.value as DocumentType })}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {Object.values(DocumentType).map((type) => (
              <option key={type} value={type}>
                {DOCUMENT_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reason */}
      <div className='mt-6'>
        <label className='block text-sm font-medium text-slate-900 mb-2'>Claim Reason *</label>
        <textarea
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none ${
            validationErrors.reason ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder='Describe the reason for your claim...'
        />
        {validationErrors.reason && <p className='text-red-600 text-sm mt-1'>{validationErrors.reason}</p>}
      </div>

      {/* Checkboxes */}
      <div className='mt-6 space-y-3'>
        <label className='flex items-center gap-3 cursor-pointer'>
          <input
            type='checkbox'
            checked={formData.signature_verified}
            onChange={(e) => setFormData({ ...formData, signature_verified: e.target.checked })}
            className='w-4 h-4 rounded border-gray-300 text-blue-600'
          />
          <span className='text-sm text-slate-900'>I verify my signature on the claim documents</span>
        </label>
        <label className='flex items-center gap-3 cursor-pointer'>
          <input
            type='checkbox'
            checked={formData.stamp_verified}
            onChange={(e) => setFormData({ ...formData, stamp_verified: e.target.checked })}
            className='w-4 h-4 rounded border-gray-300 text-blue-600'
          />
          <span className='text-sm text-slate-900'>I verify the medical facility stamp is authentic</span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type='submit'
        disabled={loading}
        className='w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2'
      >
        {loading && <Loader className='w-5 h-5 animate-spin' />}
        {loading ? 'Submitting...' : 'Submit Claim'}
      </button>
    </form>
  )
}
