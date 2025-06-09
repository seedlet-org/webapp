'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SeedletLoader } from '@/components/SeedletLoader'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/auth/login')
    }, 2000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <SeedletLoader />
    </div>
  )
}
