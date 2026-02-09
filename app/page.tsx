'use client'

import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import Header from '@/src/components/header'
import Hero from '@/src/components/hero'
import Features from '@/src/components/features'
import CTA from '@/src/components/cta'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <CTA />
    </div>
  )
}
