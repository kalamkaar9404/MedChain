'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className='bg-slate-900 text-white shadow-lg'>
      <nav className='max-w-7xl mx-auto px-4 py-4 flex justify-between items-center'>
        <Link href='/' className='flex items-center gap-2 font-bold text-xl'>
          <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>HC</div>
          <span>HealthClaim</span>
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden md:flex gap-8'>
          <Link href='/' className='hover:text-blue-400 transition'>
            Home
          </Link>
          <Link href='/patient/dashboard' className='hover:text-blue-400 transition'>
            Patient
          </Link>
          <Link href='/insurer/dashboard' className='hover:text-blue-400 transition'>
            Insurer
          </Link>
          <Link href='/auditor/dashboard' className='hover:text-blue-400 transition'>
            Auditor
          </Link>
          <Link href='/blockchain' className='hover:text-blue-400 transition'>
            Blockchain
          </Link>
          <Link href='/demo' className='hover:text-blue-400 transition'>
            Demo
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className='md:hidden' onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className='md:hidden bg-slate-800 px-4 py-4 space-y-2'>
          <Link href='/' className='block hover:text-blue-400 transition py-2'>
            Home
          </Link>
          <Link href='/patient/dashboard' className='block hover:text-blue-400 transition py-2'>
            Patient
          </Link>
          <Link href='/insurer/dashboard' className='block hover:text-blue-400 transition py-2'>
            Insurer
          </Link>
          <Link href='/auditor/dashboard' className='block hover:text-blue-400 transition py-2'>
            Auditor
          </Link>
          <Link href='/blockchain' className='block hover:text-blue-400 transition py-2'>
            Blockchain
          </Link>
          <Link href='/demo' className='block hover:text-blue-400 transition py-2'>
            Demo
          </Link>
        </div>
      )}
    </header>
  )
}
