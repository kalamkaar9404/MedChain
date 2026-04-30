'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react'

export function HeroSection() {
  return (
    <section className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div className='space-y-6'>
            <div className='space-y-4'>
              <h1 className='text-5xl md:text-6xl font-bold leading-tight text-balance'>
                Healthcare Claims Reimagined
              </h1>
              <p className='text-xl text-slate-300 text-balance'>
                AI-powered claim settlement with blockchain transparency and fraud detection. Faster processing, better outcomes.
              </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <Link href='/patient/dashboard'>
                <Button size='lg' className='bg-blue-600 hover:bg-blue-700 w-full sm:w-auto'>
                  Submit a Claim <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>
              <Link href='/demo'>
                <Button size='lg' variant='outline' className='text-white border-white hover:bg-white/10 w-full sm:w-auto'>
                  View Demo
                </Button>
              </Link>
            </div>

            <div className='grid grid-cols-3 gap-4 pt-6'>
              <div>
                <p className='text-3xl font-bold'>99.9%</p>
                <p className='text-sm text-slate-400'>Uptime SLA</p>
              </div>
              <div>
                <p className='text-3xl font-bold'>2h</p>
                <p className='text-sm text-slate-400'>Avg Processing</p>
              </div>
              <div>
                <p className='text-3xl font-bold'>100%</p>
                <p className='text-sm text-slate-400'>Auditable</p>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <Card className='bg-slate-800/50 border-slate-700'>
              <CardContent className='p-6'>
                <div className='flex gap-4'>
                  <Shield className='h-8 w-8 text-green-400 flex-shrink-0' />
                  <div>
                    <h3 className='font-semibold mb-1'>Secure & Compliant</h3>
                    <p className='text-sm text-slate-300'>HIPAA compliant with encryption at rest and in transit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-slate-800/50 border-slate-700'>
              <CardContent className='p-6'>
                <div className='flex gap-4'>
                  <Zap className='h-8 w-8 text-yellow-400 flex-shrink-0' />
                  <div>
                    <h3 className='font-semibold mb-1'>Real-time Processing</h3>
                    <p className='text-sm text-slate-300'>AI algorithms analyze claims instantly for faster decisions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-slate-800/50 border-slate-700'>
              <CardContent className='p-6'>
                <div className='flex gap-4'>
                  <BarChart3 className='h-8 w-8 text-blue-400 flex-shrink-0' />
                  <div>
                    <h3 className='font-semibold mb-1'>Complete Transparency</h3>
                    <p className='text-sm text-slate-300'>Blockchain-backed immutable audit trail</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
