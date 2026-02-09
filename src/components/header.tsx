'use client'

import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { Search, Bell, MessageSquare, User } from 'lucide-react'
import { useAuth } from '@/src/hooks/use-auth'

export default function Header() {
  const { isLoggedIn, user } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">L</span>
            </div>
            <span className="hidden text-xl font-bold text-foreground sm:inline">
              LyFind
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/browse"
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              Browse Items
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              About
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden flex-1 max-w-xs lg:block">
            <div className="relative">
              <input
                type="search"
                placeholder="Search items..."
                className="w-full rounded-lg bg-card px-3 py-2 pl-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-card"
                >
                  <Link href="/messages">
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-card"
                >
                  <Link href="/profile">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Link href="/post">Post Item</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="border-border bg-transparent text-foreground hover:bg-card"
                >
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="hidden bg-accent text-accent-foreground hover:bg-accent/90 sm:inline-flex"
                >
                  <Link href="/post">Post Item</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
