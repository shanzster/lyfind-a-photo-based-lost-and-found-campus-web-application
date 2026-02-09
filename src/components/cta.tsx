'use client'

import Link from 'next/link'
import { Button } from '@/src/components/ui/button'

export default function CTA() {
  return (
    <section className="py-20 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Ready to Find Your Items?
        </h2>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-12">
          Join thousands of students already using LyFind to recover lost belongings and help others find theirs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            <Link href="/post">Get Started Now</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-border bg-transparent text-foreground hover:bg-card"
          >
            <Link href="/browse">Browse Listings</Link>
          </Button>
        </div>

        <p className="text-sm text-foreground/50 mt-8">
          No credit card required. Start helping your community today.
        </p>
      </div>
    </section>
  )
}
