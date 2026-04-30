'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle, Zap, Shield, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className=''>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-4 overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl'></div>
          <div className='absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl'></div>
        </div>

        <div className='relative max-w-6xl mx-auto text-center'>
          <h1 className='text-5xl md:text-6xl font-bold mb-6 leading-tight text-balance'>
            Healthcare Claims Settlement Powered by AI & Blockchain
          </h1>
          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto text-balance'>
            Transparent, secure, and instant insurance claim processing. Reduce processing time by 99.9% and eliminate fraudulent claims with our intelligent settlement platform.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/patient/dashboard'
              className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition'
            >
              Submit a Claim <ArrowRight size={20} />
            </Link>
            <Link
              href='/demo'
              className='inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-lg font-semibold transition'
            >
              View Demo <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 px-4 bg-white'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <p className='text-5xl font-bold text-blue-600 mb-2'>99.9%</p>
              <p className='text-gray-600 text-lg'>Faster Processing</p>
            </div>
            <div className='text-center'>
              <p className='text-5xl font-bold text-green-600 mb-2'>70%</p>
              <p className='text-gray-600 text-lg'>Fraud Reduction</p>
            </div>
            <div className='text-center'>
              <p className='text-5xl font-bold text-purple-600 mb-2'>100%</p>
              <p className='text-gray-600 text-lg'>Transparent & Auditable</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 px-4'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-4xl font-bold text-center mb-12 text-slate-900'>Powerful Features</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-500 hover:shadow-xl transition'>
              <Zap className='w-12 h-12 text-blue-600 mb-4' />
              <h3 className='text-xl font-bold text-slate-900 mb-3'>Instant Processing</h3>
              <p className='text-gray-600'>Claims processed and verified in seconds using AI verification</p>
            </div>

            <div className='bg-white rounded-lg shadow-lg p-8 border-t-4 border-green-500 hover:shadow-xl transition'>
              <Shield className='w-12 h-12 text-green-600 mb-4' />
              <h3 className='text-xl font-bold text-slate-900 mb-3'>Fraud Detection</h3>
              <p className='text-gray-600'>Advanced anomaly detection prevents fraudulent claims before approval</p>
            </div>

            <div className='bg-white rounded-lg shadow-lg p-8 border-t-4 border-purple-500 hover:shadow-xl transition'>
              <CheckCircle className='w-12 h-12 text-purple-600 mb-4' />
              <h3 className='text-xl font-bold text-slate-900 mb-3'>Full Transparency</h3>
              <p className='text-gray-600'>Blockchain ensures all transactions are immutable and auditable</p>
            </div>

            <div className='bg-white rounded-lg shadow-lg p-8 border-t-4 border-orange-500 hover:shadow-xl transition'>
              <TrendingUp className='w-12 h-12 text-orange-600 mb-4' />
              <h3 className='text-xl font-bold text-slate-900 mb-3'>Real-time Analytics</h3>
              <p className='text-gray-600'>Monitor claims, trends, and system performance in real-time</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='py-16 px-4 bg-gradient-to-r from-slate-50 to-blue-50'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-4xl font-bold text-center mb-12 text-slate-900'>How It Works</h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='relative'>
              <div className='flex items-center gap-4 mb-4'>
                <div className='flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg'>
                  1
                </div>
                <h3 className='text-xl font-bold text-slate-900'>Submit Claim</h3>
              </div>
              <p className='text-gray-600 ml-16'>
                Patients submit medical claims with documents securely. Instant verification begins immediately.
              </p>
            </div>

            <div className='relative'>
              <div className='flex items-center gap-4 mb-4'>
                <div className='flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-600 text-white font-bold text-lg'>
                  2
                </div>
                <h3 className='text-xl font-bold text-slate-900'>AI Verification</h3>
              </div>
              <p className='text-gray-600 ml-16'>
                Our intelligent system analyzes claims for fraud, policy compliance, and authenticity. Flagged items undergo auditing.
              </p>
            </div>

            <div className='relative'>
              <div className='flex items-center gap-4 mb-4'>
                <div className='flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-600 text-white font-bold text-lg'>
                  3
                </div>
                <h3 className='text-xl font-bold text-slate-900'>Instant Payment</h3>
              </div>
              <p className='text-gray-600 ml-16'>
                Approved claims are settled instantly. All transactions are recorded on our blockchain for transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 px-4 bg-blue-600 text-white'>
        <div className='max-w-2xl mx-auto text-center'>
          <h2 className='text-4xl font-bold mb-6'>Ready to Transform Your Claims?</h2>
          <p className='text-lg text-blue-100 mb-8'>
            Join hundreds of healthcare providers and insurers using HealthClaim for faster, transparent settlements.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/patient/dashboard'
              className='inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold transition'
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link
              href='/demo'
              className='inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold transition'
            >
              Explore Demo <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
