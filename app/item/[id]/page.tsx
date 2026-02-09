'use client'

import Link from 'next/link'
import Header from '@/src/components/header'
import { Button } from '@/src/components/ui/button'
import { MessageSquare, Share2, MapPin, Calendar, User, ArrowLeft, Heart } from 'lucide-react'
import { useState } from 'react'

const mockItem = {
  id: 1,
  title: 'Blue Backpack',
  category: 'Bags',
  type: 'lost',
  location: 'Library',
  date: '2024-02-08',
  image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
  description: 'Lost blue Nike backpack with laptop inside. Has my initials "JD" written inside the front pocket. Went missing on February 8th around 3 PM near the library study area.',
  fullDescription: `I accidentally left my blue Nike backpack at the library while studying. It contains my laptop, some textbooks, and personal items. The backpack has distinctive wear marks on the bottom left corner and a small rip on the inside pocket where I store my wallet.

If you find this backpack or see anyone with it, please contact me immediately. I'm offering a reward for its return.`,
  user: {
    name: 'Alex Student',
    initials: 'AS',
    email: 'alex.student@school.edu',
    posts: 2,
    verified: true,
  },
  reward: 'Offered',
  images: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
  ],
}

export default function ItemDetailPage() {
  const [liked, setLiked] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="rounded-lg overflow-hidden border border-border mb-8 bg-muted">
              <img
                src={mockItem.image || "/placeholder.svg"}
                alt={mockItem.title}
                className="w-full h-80 object-cover"
              />
            </div>

            {/* Item Details */}
            <div className="rounded-lg border border-border bg-card p-8 mb-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{mockItem.title}</h1>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      mockItem.type === 'lost'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}
                  >
                    {mockItem.type.charAt(0).toUpperCase() + mockItem.type.slice(1)}
                  </span>
                </div>
                <p className="text-foreground/60 text-sm">{mockItem.category}</p>
              </div>
              <button
                onClick={() => setLiked(!liked)}
                className={`p-3 rounded-lg transition-colors ${
                  liked
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Heart className="h-6 w-6" fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground/60">Location</p>
                  <p className="font-semibold text-foreground">{mockItem.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground/60">Date</p>
                  <p className="font-semibold text-foreground">
                    {new Date(mockItem.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">Description</h2>
              <p className="text-foreground/70 leading-relaxed mb-4">{mockItem.description}</p>
              <p className="text-foreground/70 leading-relaxed whitespace-pre-line">{mockItem.fullDescription}</p>
            </div>

            {/* Reward */}
            {mockItem.reward && (
              <div className="rounded-lg bg-accent/10 border border-accent/20 p-4 mb-8">
                <p className="text-sm text-foreground/60 mb-1">Reward Status</p>
                <p className="font-semibold text-accent">{mockItem.reward}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* User Card */}
            <div className="rounded-xl border border-border bg-card p-6 mb-6 sticky top-20">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center font-semibold text-primary-foreground">
                  {mockItem.user.initials}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    {mockItem.user.name}
                    {mockItem.user.verified && (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-white text-xs">
                        ✓
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-foreground/60">{mockItem.user.posts} posts</p>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  onClick={() => setShowContactForm(true)}
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-border text-foreground hover:bg-card bg-transparent"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Contact Info Notice */}
              <p className="text-xs text-foreground/50 text-center">
                Contact will go through LyFind messaging
              </p>
            </div>
          </div>
        </div>

        {/* Similar Items Section */}
        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Similar Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Link key={i} href="/browse">
                <div className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all">
                  <div className="h-40 bg-muted" />
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">Similar Item {i}</h3>
                    <p className="text-sm text-foreground/60">View more items</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Message Modal */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="rounded-xl bg-card border border-border p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-foreground mb-4">Contact {mockItem.user.name}</h2>
            <textarea
              placeholder="Write your message..."
              className="w-full rounded-lg bg-background p-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary resize-none mb-4 h-32"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowContactForm(false)}
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-background"
              >
                Cancel
              </Button>
              <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
