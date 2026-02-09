'use client'

import { Camera, Zap, MessageSquare, Bell, Search, Lock } from 'lucide-react'

const features = [
  {
    icon: Camera,
    title: 'Photo Upload',
    description: 'Snap and upload photos of items instantly with our intuitive mobile-first interface.',
  },
  {
    icon: Zap,
    title: 'Smart Matching',
    description: 'AI-powered algorithm matches items based on photos, descriptions, and location data.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Messaging',
    description: 'Connect with other students safely through our built-in messaging system.',
  },
  {
    icon: Bell,
    title: 'Real-Time Notifications',
    description: 'Get instant alerts when potential matches are found for your items.',
  },
  {
    icon: Search,
    title: 'Advanced Search',
    description: 'Filter by category, date, location, and item type to find what you need faster.',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'All data is encrypted. Your identity and information are completely protected.',
  },
]

export default function Features() {
  return (
    <section className="py-20 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Everything you need to reunite lost items with their owners
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="rounded-lg border border-border bg-card p-8"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Icon className="h-6 w-6 text-secondary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
