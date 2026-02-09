import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar } from 'lucide-react';

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
];

const categories = ['All', 'Bags', 'Jewelry', 'Clothing', 'Accessories', 'Keys', 'Electronics'];
const typeFilters = ['All', 'Lost', 'Found'];

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = mockItems.filter((item) => {
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
    const typeMatch = selectedType === 'All' || item.type.toLowerCase() === selectedType.toLowerCase();
    const searchMatch = searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && typeMatch && searchMatch;
  });

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Browse Items</h1>
        <p className="text-lg text-foreground/60">Find items that match what you're looking for</p>
      </div>

      <div className="mb-8 space-y-4">
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

      <div className="mb-6">
        <p className="text-sm text-foreground/60">
          Showing <span className="font-semibold text-foreground">{filteredItems.length}</span> items
        </p>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Link key={item.id} to={`/item/${item.id}`}>
              <div className="rounded-lg border border-border bg-card overflow-hidden hover:border-primary transition-colors">
                <div className="relative h-40 overflow-hidden bg-muted">
                  <img
                    src={item.image}
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

                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-3">{item.title}</h3>

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
  );
}
