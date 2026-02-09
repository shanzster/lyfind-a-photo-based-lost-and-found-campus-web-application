'use client'

import Header from '@/src/components/header'
import { Button } from '@/src/components/ui/button'
import Link from 'next/link'
import { Heart, Users, Zap, Shield } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">About LyFind</h1>
          <p className="text-xl text-foreground/60">
            Connecting communities through smart photo-based item recovery
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16 rounded-xl border border-border bg-card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-lg text-foreground/70 leading-relaxed">
            LyFind was created to solve a simple but persistent problem: lost items often go unclaimed, while found items
            have no way to reach their owners. We believe that technology can bridge this gap, making it easier for school
            communities to help each other recover their belongings.
          </p>
        </div>

        {/* Why LyFind Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Why LyFind?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'AI-powered photo matching connects lost and found items instantly.',
              },
              {
                icon: Users,
                title: 'Community First',
                description: 'Connect directly with other students without intermediaries.',
              },
              {
                icon: Shield,
                title: 'Safe & Secure',
                description: 'All communications are encrypted and verified through the school.',
              },
              {
                icon: Heart,
                title: 'Built for Good',
                description: 'Helping your community recover belongings, one post at a time.',
              },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="rounded-lg border border-border bg-background p-6">
                  <Icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-foreground/60 text-sm">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16 rounded-xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5K+</div>
              <p className="text-foreground/60">Items Recovered</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">98%</div>
              <p className="text-foreground/60">Success Rate</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">2K+</div>
              <p className="text-foreground/60">Active Users</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Find Your Items?</h2>
          <p className="text-foreground/60 mb-6">
            Join thousands of students already using LyFind to recover their belongings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              <Link href="/browse">Browse Items</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-background bg-transparent"
            >
              <Link href="/post">Post Item</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
