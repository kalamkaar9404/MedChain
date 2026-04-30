'use client'

import { ClaimForm } from '@/components/claims/ClaimForm'
import { ClaimsList } from '@/components/claims/ClaimsList'

export default function PatientDashboard() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-slate-900 mb-2'>Patient Dashboard</h1>
          <p className='text-gray-600'>Submit and track your insurance claims</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Form Section */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8'>
              <ClaimForm />
            </div>
          </div>

          {/* Claims List Section */}
          <div className='lg:col-span-2'>
            <ClaimsList />
          </div>
        </div>
      </div>
    </div>
  )
}
