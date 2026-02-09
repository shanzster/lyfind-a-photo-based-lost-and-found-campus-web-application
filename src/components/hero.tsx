'use client'

import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { Camera, Search, Users } from 'lucide-react'

export default function Hero() {
  return (
    <section className="py-20 sm:py-32 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Subtitle */}
          <p className="mb-4 text-sm font-medium text-secondary">Smart Photo-Based Platform</p>

          {/* Main headline */}
          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Find Your Lost Items
          </h1>

          <h2 className="mb-8 text-balance text-2xl font-semibold text-accent sm:text-3xl">
            In Seconds
          </h2>

          {/* Subheading */}
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-foreground/70">
            LyFind connects your school community through intelligent photo matching. Post items you've lost or found and get matched with other students in real-time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              <Link href="/post">Post a Lost Item</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary bg-transparent text-primary hover:bg-primary/10"
            >
              <Link href="/browse">Browse Found Items</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-16 border-t border-border">
            <div>
              <div className="text-3xl font-bold text-accent mb-2">98%</div>
              <p className="text-sm text-foreground/60">Match Success</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">2hrs</div>
              <p className="text-sm text-foreground/60">Avg Response</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">5K+</div>
              <p className="text-sm text-foreground/60">Items Returned</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
