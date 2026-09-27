import { requireUnAuth } from '@/module/authentication/actions'
import React from 'react'

const Authlayout = async ({children}: {children: React.ReactNode}) => {
 await requireUnAuth()
  return (
    <div className='min-h-screen flex items-center justify-center'>
        {children}
    </div>
  )
}
export default Authlayout