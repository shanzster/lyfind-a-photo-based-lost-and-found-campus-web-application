'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/src/components/header'
import { Button } from '@/src/components/ui/button'
import { Search, Filter, MapPin, Calendar, Tag } from 'lucide-react'
import { useItems } from '@/src/hooks/use-items'

const mockItems = [
  {
    id: 1,
    title: 'Blue Backpack',
    category: 'Bags',
    type: 'lost',
    location: 'Library',
    date: '2024-02-08',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    description: 'Lost blue Nike backpack with laptop inside',
    user: 'Alex Student',
    initials: 'AS',
  },
  {
    id: 2,
    title: 'Gold Earrings',
    category: 'Jewelry',
    type: 'found',
    location: 'Cafeteria',
    date: '2024-02-07',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop',
    description: 'Found a pair of gold hoop earrings',
    user: 'Jordan Lee',
    initials: 'JL',
  },
  {
    id: 3,
    title: 'Grey Hoodie',
    category: 'Clothing',
    type: 'lost',
    location: 'Gym',
    date: '2024-02-06',
    image: 'https://images.unsplash.com/photo-1556821552-9f6db851c3f3?w=400&h=300&fit=crop',
    description: 'Lost grey hoodie with white drawstrings',
    user: 'Sam Chen',
    initials: 'SC',
  },
  {
    id: 4,
    title: 'Silver Watch',
    category: 'Accessories',
    type: 'found',
    location: 'Parking Lot',
    date: '2024-02-05',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=300&fit=crop',
    description: 'Found a silver watch near the entrance',
    user: 'Taylor Kim',
    initials: 'TK',
  },
  {
    id: 5,
    title: 'Red Wallet',
    category: 'Accessories',
    type: 'lost',
    location: 'Auditorium',
    date: '2024-02-04',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop',
    description: 'Lost red leather wallet with ID inside',
    user: 'Morgan Scott',
    initials: 'MS',
  },
  {
    id: 6,
    title: 'Key Ring',
    category: 'Keys',
    type: 'found',
    location: 'Computer Lab',
    date: '2024-02-03',
    image: 'https://images.unsplash.com/photo-1509905925454-4ae57f0b567d?w=400&h=300&fit=crop',
    description: 'Found a key ring with multiple keys',
    user: 'Casey Park',
    initials: 'CP',
  },
]

const categories = ['All', 'Bags', 'Jewelry', 'Clothing', 'Accessories', 'Keys', 'Electronics']
const typeFilters = ['All', 'Lost', 'Found']

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = mockItems.filter((item) => {
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory
    const typeMatch = selectedType === 'All' || item.type.toLowerCase() === selectedType.toLowerCase()
    const searchMatch = searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase())
    return categoryMatch && typeMatch && searchMatch
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Browse Items</h1>
          <p className="text-lg text-foreground/60">Find items that match what you're looking for</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-10 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border text-foreground hover:bg-card'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-accent text-accent-foreground'
                      : 'border border-border text-foreground hover:bg-card'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-foreground/60">
            Showing <span className="font-semibold text-foreground">{filteredItems.length}</span> items
          </p>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Link key={item.id} href={`/item/${item.id}`}>
                <div className="rounded-lg border border-border bg-card overflow-hidden hover:border-primary transition-colors">
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden bg-muted">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <span
                      className={`absolute top-3 right-3 rounded px-2 py-1 text-xs font-medium ${
                        item.type === 'lost'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-green-500/20 text-green-300'
                      }`}
                    >
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-3">
                      {item.title}
                    </h3>

                    <div className="space-y-2 mb-4 text-sm text-foreground/60">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* User */}
                    <div className="pt-3 border-t border-border flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-accent-foreground">
                        {item.initials}
                      </div>
                      <span className="text-sm text-foreground/70">{item.user}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-foreground/60 mb-2">No items found matching your filters.</p>
            <p className="text-sm text-foreground/40">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  )
}
