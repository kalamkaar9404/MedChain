export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-slate-900 text-white py-8 mt-16'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          <div>
            <h3 className='font-bold mb-4'>About</h3>
            <p className='text-gray-400 text-sm'>
              Healthcare Settlement Platform powered by AI and blockchain for transparent claim processing.
            </p>
          </div>
          <div>
            <h3 className='font-bold mb-4'>For Patients</h3>
            <ul className='text-gray-400 text-sm space-y-2'>
              <li>
                <a href='/patient/dashboard' className='hover:text-blue-400'>
                  Submit Claim
                </a>
              </li>
              <li>
                <a href='/patient/dashboard' className='hover:text-blue-400'>
                  Track Status
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='font-bold mb-4'>For Partners</h3>
            <ul className='text-gray-400 text-sm space-y-2'>
              <li>
                <a href='/insurer/dashboard' className='hover:text-blue-400'>
                  Insurer Portal
                </a>
              </li>
              <li>
                <a href='/auditor/dashboard' className='hover:text-blue-400'>
                  Audit Tools
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='font-bold mb-4'>Resources</h3>
            <ul className='text-gray-400 text-sm space-y-2'>
              <li>
                <a href='/blockchain' className='hover:text-blue-400'>
                  Blockchain Explorer
                </a>
              </li>
              <li>
                <a href='/status' className='hover:text-blue-400'>
                  System Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-slate-700 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm'>
            <p>&copy; {currentYear} HealthClaim. All rights reserved.</p>
            <div className='flex gap-4 mt-4 md:mt-0'>
              <a href='#' className='hover:text-blue-400'>
                Privacy
              </a>
              <a href='#' className='hover:text-blue-400'>
                Terms
              </a>
              <a href='#' className='hover:text-blue-400'>
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
