import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Share2, MapPin, Calendar, ArrowLeft } from 'lucide-react';

export default function ItemPage() {
  const { id } = useParams();

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/browse"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Browse
      </Link>

      <div className="rounded-lg border border-border bg-card p-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Item #{id}</h1>
        <p className="text-foreground/60">Item details will be loaded from the API</p>
      </div>
    </main>
  );
}
