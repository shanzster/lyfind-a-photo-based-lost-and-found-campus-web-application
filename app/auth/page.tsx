'use client'

import React from "react"
import { useState } from 'react'
import Link from 'next/link'
import Header from '@/src/components/header'
import { Button } from '@/src/components/ui/button'
import { Mail, Lock, User, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth' // Import useAuth hook

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const { login, signup } = useAuth() // Declare useAuth hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (isSignIn) {
        // Mock sign in - in real app, would validate against backend
        const mockUser = {
          id: 'user-' + Date.now(),
          name: 'School User',
          email: formData.email,
          phone: '(555) 123-4567',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
          joinDate: new Date().toISOString().split('T')[0],
          itemsPosted: 0,
        }
        login(mockUser)
      } else {
        // Mock sign up
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match')
          setIsLoading(false)
          return
        }
        const newUser = {
          id: 'user-' + Date.now(),
          name: formData.name,
          email: formData.email,
          phone: '',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
          joinDate: new Date().toISOString().split('T')[0],
          itemsPosted: 0,
        }
        signup(newUser)
      }
      
      // Redirect to profile or home
      window.location.href = '/profile'
    } catch (error) {
      alert('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-lg border border-border bg-card p-8">
            {/* Heading */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {isSignIn ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-foreground/60 text-sm">
                {isSignIn ? "Sign in to your account" : "Join LyFind today"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              {!isSignIn && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required={!isSignIn}
                      className="w-full rounded-lg bg-background pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@school.edu"
                    required
                    className="w-full rounded-lg bg-background pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-lg bg-background pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              {!isSignIn && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required={!isSignIn}
                      className="w-full rounded-lg bg-background pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-10"
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isSignIn ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-foreground/60">or continue with</span>
                </div>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-background bg-transparent"
              >
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-background bg-transparent"
              >
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>

            {/* Toggle Sign In / Sign Up */}
            <div className="text-center">
              <p className="text-sm text-foreground/60">
                {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => setIsSignIn(!isSignIn)}
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  {isSignIn ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-foreground/50">
            By continuing, you agree to our{' '}
            <Link href="#" className="underline hover:text-foreground/70">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="underline hover:text-foreground/70">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
