import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut, Mail, Phone } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
          <ArrowLeft className="h-4 w-4" />
          Back Home
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-card p-8">
        <h1 className="text-2xl font-bold text-foreground mb-4">My Profile</h1>
        <p className="text-foreground/60">Profile content here</p>
      </div>
    </div>
  );
}
