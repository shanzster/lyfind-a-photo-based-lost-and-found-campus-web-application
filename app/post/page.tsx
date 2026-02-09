'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/src/components/header'
import { Button } from '@/src/components/ui/button'
import { Upload, ArrowLeft, ImagePlus, Loader2 } from 'lucide-react'
import { useAuth } from '@/src/hooks/use-auth'
import { useItems } from '@/src/hooks/use-items'

const categories = ['electronics', 'accessories', 'documents', 'clothing', 'other']
const locations = ['Library', 'Cafeteria', 'Gym', 'Parking Lot', 'Auditorium', 'Computer Lab', 'Hallway', 'Other']

export default function PostPage() {
  const { user, isLoggedIn } = useAuth()
  const { addItem } = useItems()
  
  const [formData, setFormData] = useState({
    itemType: 'lost' as 'lost' | 'found',
    title: '',
    category: 'electronics' as any,
    location: '',
    date: '',
    description: '',
    reward: '',
  })
  const [images, setImages] = useState<File[]>([])
  const [preview, setPreview] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
      setImages([...images, ...newFiles])
      setPreview([...preview, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setPreview(preview.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!isLoggedIn) {
      window.location.href = '/auth'
      return
    }

    setIsSubmitting(true)

    try {
      // Use first image as item image, or use a default
      const itemImage = preview[0] || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'
      
      const newItem = addItem({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.itemType,
        status: 'active',
        image: itemImage,
        location: formData.location,
        date: formData.date,
        postedBy: user?.name || 'Anonymous',
        contact: user?.email || '',
        email: user?.email,
        phone: user?.phone,
      })

      setTimeout(() => {
        setIsSubmitting(false)
        setSubmitted(true)
        
        // Redirect after success
        setTimeout(() => {
          window.location.href = `/item/${newItem.id}`
        }, 1500)
      }, 1000)
    } catch (error) {
      setIsSubmitting(false)
      alert('Failed to post item. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <div className="mx-auto mb-6 h-12 w-12 flex items-center justify-center text-2xl">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Item Posted Successfully</h1>
            <p className="text-foreground/60 mb-8">
              Your {formData.itemType} item has been listed. The community will help you reunite it.
            </p>
            <div className="space-y-3">
              <Button
                asChild
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/browse">View Similar Items</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-border text-foreground hover:bg-card bg-transparent"
              >
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back Home
        </Link>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Post an Item</h1>
          <p className="text-lg text-foreground/60">
            Help reunite items with their owners or find what you've lost
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Type */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">What are you posting?</label>
            <div className="grid grid-cols-2 gap-3">
              {['lost', 'found'].map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-3 rounded border p-3 cursor-pointer transition-colors ${
                    formData.itemType === type
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:bg-card/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="itemType"
                    value={type}
                    checked={formData.itemType === type}
                    onChange={handleInputChange}
                    className="h-4 w-4"
                  />
                  <span className="font-medium text-foreground capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-2">
                Item Title *
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Blue Nike Backpack"
                required
                className="w-full rounded-lg bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-foreground mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-foreground mb-2">
                  Location *
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-foreground mb-2">
                Date *
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide detailed description and any distinguishing features..."
                required
                rows={5}
                className="w-full rounded-lg bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label htmlFor="reward" className="block text-sm font-semibold text-foreground mb-2">
                Reward (Optional)
              </label>
              <input
                id="reward"
                type="text"
                name="reward"
                value={formData.reward}
                onChange={handleInputChange}
                placeholder="e.g., $50 reward"
                className="w-full rounded-lg bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="rounded-xl border border-border bg-card p-6">
            <label className="block text-sm font-semibold text-foreground mb-4">Upload Photos *</label>

            {/* Upload Area */}
            <label className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8 cursor-pointer hover:border-primary/50 transition-colors bg-background/50 mb-4">
              <div className="text-center">
                <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="font-semibold text-foreground mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-foreground/60">PNG, JPG, GIF up to 10MB</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Image Preview */}
            {preview.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {preview.map((src, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden bg-muted">
                    <img
                      src={src || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="h-32 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 rounded-full bg-destructive/80 hover:bg-destructive p-1 text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {preview.length === 0 && (
              <p className="text-sm text-foreground/50 text-center">No images selected</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              asChild
              variant="outline"
              size="lg"
              className="flex-1 border-border text-foreground hover:bg-background bg-transparent"
            >
              <Link href="/">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.category || !formData.date}
              size="lg"
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Post Item
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-foreground/50 text-center">
            By posting, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      </main>
    </div>
  )
}
