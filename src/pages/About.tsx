import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back Home
      </Link>

      <div className="rounded-lg border border-border bg-card p-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">About Us</h1>
        <p className="text-lg text-foreground/60">Learn more about our platform</p>
      </div>
    </main>
  );
}
