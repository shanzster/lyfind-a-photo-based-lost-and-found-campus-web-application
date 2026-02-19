import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, LogOut, Sparkles, Package, MessageSquare, User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/browse" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
          <p className="text-foreground/60">Manage your profile and access AI features</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/photo-match">
            <Card className="border-border bg-gradient-to-br from-primary/10 to-primary/5 p-6 hover:border-primary transition-all hover:shadow-lg cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    Photo Matching AI
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">NEW</span>
                  </h3>
                  <p className="text-sm text-foreground/60">Find similar items with AI</p>
                </div>
              </div>
            </Card>
          </Link>

          <Card className="border-border bg-card p-6 hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Package className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">My Items</h3>
                <p className="text-sm text-foreground/60">View your posts</p>
              </div>
            </div>
          </Card>

          <Link to="/messages">
            <Card className="border-border bg-card p-6 hover:border-primary transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <MessageSquare className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Messages</h3>
                  <p className="text-sm text-foreground/60">View conversations</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Profile Info */}
        <Card className="border-border bg-card p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">John Doe</h2>
              <p className="text-foreground/60">john.doe@example.com</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 rounded-lg bg-background">
              <p className="text-3xl font-bold text-primary">5</p>
              <p className="text-sm text-foreground/60 mt-1">Items Posted</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background">
              <p className="text-3xl font-bold text-accent">3</p>
              <p className="text-sm text-foreground/60 mt-1">Active Items</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background">
              <p className="text-3xl font-bold text-secondary">2</p>
              <p className="text-sm text-foreground/60 mt-1">Resolved</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="text-sm font-medium text-foreground/60">Full Name</label>
              <p className="text-foreground mt-1">John Doe</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground/60">Email</label>
              <p className="text-foreground mt-1">john.doe@example.com</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground/60">Member Since</label>
              <p className="text-foreground mt-1">February 2024</p>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-border">
            <Button variant="outline">
              Edit Profile
            </Button>
            <Button variant="destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
