'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // check auth
    // if not, router.push('/auth/login')
  }, [])

  return <>{children}</>
}