'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { Card } from '@/src/components/ui/card'
import { ArrowLeft, LogOut, Edit2, Mail, Phone } from 'lucide-react'
import { useAuth } from '@/src/hooks/use-auth'
import { mockItems } from '@/src/lib/mock-data'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(
    user || {
      id: '',
      name: '',
      email: '',
      phone: '',
      avatar: '',
      joinDate: new Date().toISOString().split('T')[0],
      itemsPosted: 0,
    }
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b border-border bg-card">
          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Card className="border-border bg-card p-8 text-center">
            <p className="mb-4 text-muted-foreground">
              You need to log in to view your profile.
            </p>
            <Link href="/auth">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Go to Login
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  const userItems = mockItems.filter((item) => item.postedBy === user.name)

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <Card className="border-border bg-card p-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="h-20 w-20 rounded-full border-2 border-secondary object-cover"
            />

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="w-full rounded border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editData.phone || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                      className="w-full rounded border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => {
                        setIsEditing(false)
                      }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false)
                        setEditData(user)
                      }}
                      variant="outline"
                      className="border-border text-foreground hover:bg-card"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {user.name}
                    </h2>
                    <p className="mt-1 text-sm text-foreground/60">
                      Member since {new Date(user.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="border-border text-foreground hover:bg-card"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-8">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary" />
                <span className="text-foreground">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-secondary" />
                  <span className="text-foreground">{user.phone}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Card className="border-border bg-card p-6 text-center">
            <p className="text-3xl font-bold text-primary">{userItems.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Items Posted</p>
          </Card>
          <Card className="border-border bg-card p-6 text-center">
            <p className="text-3xl font-bold text-secondary">
              {userItems.filter((i) => i.status === 'active').length}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Active</p>
          </Card>
          <Card className="border-border bg-card p-6 text-center">
            <p className="text-3xl font-bold text-accent">
              {userItems.filter((i) => i.status === 'claimed' || i.status === 'resolved').length}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Resolved</p>
          </Card>
        </div>

        {/* My Posts */}
        <Card className="border-border bg-card p-6 sm:p-8">
          <h3 className="mb-6 text-lg font-semibold text-foreground">My Posted Items</h3>
          {userItems.length === 0 ? (
            <div className="text-center">
              <p className="text-muted-foreground">No items posted yet</p>
              <Link href="/post">
                <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  Post an Item
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userItems.map((item) => (
                <Link key={item.id} href={`/item/${item.id}`}>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4 transition hover:bg-muted">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.type === 'lost' ? '🔍 Lost' : '🎯 Found'} •{' '}
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        item.status === 'active'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
