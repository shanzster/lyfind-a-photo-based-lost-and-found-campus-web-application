import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ImagePlus, Loader2 } from 'lucide-react';

const categories = ['electronics', 'accessories', 'documents', 'clothing', 'other'];
const locations = ['Library', 'Cafeteria', 'Gym', 'Parking Lot', 'Auditorium', 'Computer Lab', 'Hallway', 'Other'];

export default function PostPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemType: 'lost' as 'lost' | 'found',
    title: '',
    category: 'electronics',
    location: '',
    date: '',
    description: '',
    reward: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImages([...images, ...newFiles]);
      setPreview([...preview, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreview(preview.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const item = await response.json();
        navigate(`/item/${item.id}`);
      }
    } catch (error) {
      alert('Failed to post item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back Home
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Post an Item</h1>
        <p className="text-lg text-foreground/60">
          Help reunite items with their owners or find what you've lost
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
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
                  <option key={loc} value={loc}>{loc}</option>
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
              placeholder="Provide detailed description..."
              required
              rows={5}
              className="w-full rounded-lg bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Post Item
          </Button>
        </div>
      </form>
    </main>
  );
}
