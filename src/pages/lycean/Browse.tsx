import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Eye, Mail, Clock, TrendingUp, X, Navigation } from 'lucide-react'
import LyceanSidebar from '@/components/lycean-sidebar'

const mockItems = [
  {
    id: 1,
    title: 'Blue Nike Backpack',
    category: 'Bags',
    type: 'lost',
    location: 'Library - 2nd Floor',
    date: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    description: 'Lost blue Nike backpack with laptop inside. Has a small tear on the front pocket.',
    user: 'Alex Martinez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    views: 24,
    messages: 3,
    trending: true
  },
  {
    id: 2,
    title: 'iPhone 13 Pro',
    category: 'Electronics',
    type: 'found',
    location: 'Cafeteria',
    date: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1592286927505-c0d6c9c24e5a?w=400&h=300&fit=crop',
    description: 'Found iPhone 13 Pro with blue case. Screen has a small crack.',
    user: 'Maria Santos',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    views: 45,
    messages: 8,
    trending: true
  },
  {
    id: 3,
    title: 'Silver Bracelet',
    category: 'Jewelry',
    type: 'lost',
    location: 'Gym',
    date: '1 day ago',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop',
    description: 'Lost silver bracelet with heart charm. Sentimental value.',
    user: 'John Reyes',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    views: 67,
    messages: 5,
    trending: false
  },
  {
    id: 4,
    title: 'Black Wallet',
    category: 'Accessories',
    type: 'found',
    location: 'Parking Lot',
    date: '3 hours ago',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop',
    description: 'Found black leather wallet near the parking lot entrance. Contains ID.',
    user: 'Sarah Cruz',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    views: 89,
    messages: 12,
    trending: true
  },
  {
    id: 5,
    title: 'Red Umbrella',
    category: 'Accessories',
    type: 'lost',
    location: 'Computer Lab',
    date: '6 hours ago',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    description: 'Lost red umbrella with wooden handle. Left in Computer Lab 3.',
    user: 'David Tan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    views: 31,
    messages: 2,
    trending: false
  }
]

const categories = ['All', 'Bags', 'Electronics', 'Jewelry', 'Accessories', 'Keys', 'Clothing']

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMapModal, setShowMapModal] = useState(false)
  const [selectedItemForMap, setSelectedItemForMap] = useState<typeof mockItems[0] | null>(null)

  const filteredItems = mockItems.filter((item) => {
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory
    const typeMatch = selectedType === 'All' || item.type.toLowerCase() === selectedType.toLowerCase()
    const searchMatch = searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase())
    return categoryMatch && typeMatch && searchMatch
  })

  const handleShowMap = (item: typeof mockItems[0]) => {
    setSelectedItemForMap(item)
    setShowMapModal(true)
  }

  return (
    <>
      <LyceanSidebar />
      <main className="min-h-screen pt-6 lg:pt-12 pb-24 lg:pb-12 px-4 lg:px-6 lg:pl-80 lg:pr-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-10">
            <h1 className="text-3xl lg:text-5xl font-normal text-white mb-2 lg:mb-3">
              Lost & Found
            </h1>
            <p className="text-white/50 text-sm lg:text-lg">Discover and reunite with lost items</p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mb-4 lg:mb-6 flex flex-col gap-3 lg:gap-4">
            {/* Search */}
            <div className="w-full">
              <div className="relative group">
                <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 lg:w-5 h-4 lg:h-5 text-white/40 group-focus-within:text-[#ff7400] transition-colors" />
                <input
                  type="text"
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl text-sm lg:text-base text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 focus:bg-white/10 focus:shadow-lg focus:shadow-[#ff7400]/10 transition-all"
                />
              </div>
            </div>

            {/* Type Filter Pills - Centered */}
            <div className="flex justify-center gap-2 lg:gap-3">
              <button
                onClick={() => setSelectedType('All')}
                className={`px-8 lg:px-10 py-2.5 lg:py-4 rounded-xl lg:rounded-2xl text-sm lg:text-base font-medium transition-all ${
                  selectedType === 'All'
                    ? 'bg-[#ff7400] text-white shadow-lg shadow-[#ff7400]/30 scale-105'
                    : 'backdrop-blur-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:scale-105'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType('Lost')}
                className={`px-8 lg:px-10 py-2.5 lg:py-4 rounded-xl lg:rounded-2xl text-sm lg:text-base font-medium transition-all ${
                  selectedType === 'Lost'
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105'
                    : 'backdrop-blur-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:scale-105'
                }`}
              >
                Lost
              </button>
              <button
                onClick={() => setSelectedType('Found')}
                className={`px-8 lg:px-10 py-2.5 lg:py-4 rounded-xl lg:rounded-2xl text-sm lg:text-base font-medium transition-all ${
                  selectedType === 'Found'
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105'
                    : 'backdrop-blur-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:scale-105'
                }`}
              >
                Found
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="mb-6 lg:mb-8 flex justify-center items-center gap-2 lg:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-xs lg:text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-white/15 text-white border border-white/30 shadow-lg scale-105'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/80 hover:scale-105'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mb-4 lg:mb-6 flex items-center justify-between">
            <p className="text-white/50 text-sm lg:text-base">
              <span className="text-white font-medium lg:text-lg">{filteredItems.length}</span> items found
            </p>
            {filteredItems.length > 0 && (
              <div className="text-white/40 text-xs lg:text-sm">Most recent</div>
            )}
          </div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-[#ff7400]/10 transition-all duration-300 group animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-32 lg:h-56 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2f1632] via-transparent to-transparent opacity-60"></div>
                    
                    {/* Type Badge */}
                    <div className={`absolute top-2 lg:top-4 left-2 lg:left-4 px-2 lg:px-4 py-1 lg:py-1.5 rounded-full text-[10px] lg:text-xs font-medium backdrop-blur-md shadow-lg ${
                      item.type === 'lost'
                        ? 'bg-red-500/90 text-white'
                        : 'bg-green-500/90 text-white'
                    }`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </div>

                    {/* Trending Badge */}
                    {item.trending && (
                      <div className="absolute top-2 lg:top-4 right-2 lg:right-4 px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-[10px] lg:text-xs font-medium backdrop-blur-md bg-[#ff7400]/90 text-white shadow-lg flex items-center gap-1">
                        <TrendingUp className="w-2.5 lg:w-3 h-2.5 lg:h-3" />
                        <span className="hidden lg:inline">Trending</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 lg:p-6">
                    {/* Title */}
                    <h3 className="text-sm lg:text-xl font-medium text-white mb-1 lg:mb-2 line-clamp-1 group-hover:text-[#ff7400] transition-colors">
                      {item.title}
                    </h3>

                    {/* Description - Hidden on mobile */}
                    <p className="hidden lg:block text-white/50 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Location & Time */}
                    <div className="space-y-1 lg:space-y-2 mb-3 lg:mb-5">
                      <div className="flex items-center gap-1.5 lg:gap-2 text-white/40 text-[10px] lg:text-sm">
                        <MapPin className="w-3 lg:w-4 h-3 lg:h-4 flex-shrink-0 text-[#ff7400]" />
                        <span className="line-clamp-1">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 lg:gap-2 text-white/40 text-[10px] lg:text-sm">
                        <Clock className="w-3 lg:w-4 h-3 lg:h-4 flex-shrink-0 text-[#ff7400]" />
                        <span>{item.date}</span>
                      </div>
                    </div>

                    {/* User Info & Actions */}
                    <div className="flex items-center justify-between pt-3 lg:pt-5 border-t border-white/10">
                      {/* User - Avatar only on mobile, full info on desktop */}
                      <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                        <img
                          src={item.avatar}
                          alt={item.user}
                          className="w-7 lg:w-10 h-7 lg:h-10 rounded-full bg-white/10 ring-1 lg:ring-2 ring-white/10 group-hover:ring-[#ff7400]/30 transition-all flex-shrink-0"
                        />
                        <div className="hidden lg:flex flex-col min-w-0">
                          <span className="text-white/80 text-sm font-medium truncate">{item.user}</span>
                          <span className="text-white/30 text-xs flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {item.views} views
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                        <Link
                          to={`/item/${item.id}`}
                          className="w-7 lg:w-10 h-7 lg:h-10 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-[#ff7400] hover:border-[#ff7400] hover:scale-110 transition-all group/btn"
                        >
                          <Eye className="w-3 lg:w-4 h-3 lg:h-4 text-white/60 group-hover/btn:text-white" />
                        </Link>
                        
                        <button className="w-7 lg:w-10 h-7 lg:h-10 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-[#ff7400] hover:border-[#ff7400] hover:scale-110 transition-all group/btn"
                          onClick={() => handleShowMap(item)}
                        >
                          <MapPin className="w-3 lg:w-4 h-3 lg:h-4 text-white/60 group-hover/btn:text-white" />
                        </button>
                        
                        <button className="w-7 lg:w-10 h-7 lg:h-10 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-[#ff7400] hover:border-[#ff7400] hover:scale-110 transition-all group/btn relative">
                          <Mail className="w-3 lg:w-4 h-3 lg:h-4 text-white/60 group-hover/btn:text-white" />
                          {item.messages > 0 && (
                            <span className="absolute -top-0.5 lg:-top-1 -right-0.5 lg:-right-1 w-4 lg:w-5 h-4 lg:h-5 bg-[#ff7400] rounded-full text-[8px] lg:text-[10px] font-medium text-white flex items-center justify-center shadow-lg animate-pulse">
                              {item.messages}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-12 lg:p-16 text-center">
              <div className="w-16 lg:w-20 h-16 lg:h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <Search className="w-8 lg:w-10 h-8 lg:h-10 text-white/30" />
              </div>
              <p className="text-white/60 text-lg lg:text-xl mb-2">No items found</p>
              <p className="text-white/40 text-sm lg:text-base mb-4 lg:mb-6">Try adjusting your search or filters</p>
              <button 
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                  setSelectedType('All')
                }}
                className="px-5 lg:px-6 py-2.5 lg:py-3 bg-[#ff7400] text-white text-sm lg:text-base rounded-xl lg:rounded-2xl hover:bg-[#ff7400]/90 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Map Modal */}
      {showMapModal && selectedItemForMap && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="backdrop-blur-xl bg-[#2f1632] border border-white/10 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 lg:p-8 border-b border-white/10">
              <div className="flex-1">
                <h3 className="text-2xl lg:text-3xl font-medium text-white mb-2">Item Location</h3>
                <p className="text-white/60 text-sm lg:text-base">{selectedItemForMap.title}</p>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all flex-shrink-0 ml-4"
              >
                <X className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </button>
            </div>

            {/* Map Content */}
            <div className="relative h-[400px] lg:h-[600px] bg-gradient-to-br from-[#2f1632] to-[#1a0d1c]">
              {/* Placeholder Map */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4">
                  <div className="w-20 lg:w-24 h-20 lg:h-24 rounded-full bg-[#ff7400]/10 border border-[#ff7400]/20 flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-10 lg:w-12 h-10 lg:h-12 text-[#ff7400]" />
                  </div>
                  <h4 className="text-white text-xl lg:text-2xl font-medium mb-3">Campus Map</h4>
                  <p className="text-white/50 text-base lg:text-lg mb-6">{selectedItemForMap.location}</p>
                  <div className="inline-flex items-center gap-3 px-6 lg:px-8 py-3 lg:py-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl text-white shadow-xl">
                    <MapPin className="w-5 h-5 text-[#ff7400]" />
                    <span className="text-sm lg:text-base">Lyceum of Subic Bay Campus</span>
                  </div>
                </div>
              </div>

              {/* Location Info Overlay */}
              <div className="absolute bottom-6 lg:bottom-8 left-6 lg:left-8 right-6 lg:right-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl lg:rounded-3xl p-5 lg:p-8 shadow-2xl">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#ff7400] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-white font-medium text-lg lg:text-xl mb-2">{selectedItemForMap.location}</h5>
                    <p className="text-white/60 text-sm lg:text-base mb-3">
                      {selectedItemForMap.type === 'lost' ? 'Last seen at this location' : 'Found at this location'}
                    </p>
                    <div className="flex items-center gap-2 text-white/50 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{selectedItemForMap.date}</span>
                    </div>
                  </div>
                  <button className="w-full lg:w-auto px-6 lg:px-8 py-3 lg:py-4 bg-[#ff7400] text-white rounded-xl lg:rounded-2xl text-sm lg:text-base font-medium hover:bg-[#ff7400]/90 transition-all shadow-lg shadow-[#ff7400]/30 flex items-center justify-center gap-2">
                    <Navigation className="w-5 h-5" />
                    Get Directions
                  </button>
                </div>
              </div>
            </div>

            {/* Footer with Item Preview */}
            <div className="p-6 lg:p-8 border-t border-white/10 bg-white/5">
              <div className="flex items-center gap-4">
                <img
                  src={selectedItemForMap.image}
                  alt={selectedItemForMap.title}
                  className="w-16 lg:w-20 h-16 lg:h-20 rounded-xl object-cover ring-2 ring-white/10"
                />
                <div className="flex-1">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                    selectedItemForMap.type === 'lost'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-green-500/20 text-green-300 border border-green-500/30'
                  }`}>
                    {selectedItemForMap.type.charAt(0).toUpperCase() + selectedItemForMap.type.slice(1)}
                  </div>
                  <h6 className="text-white font-medium text-base lg:text-lg">{selectedItemForMap.title}</h6>
                  <p className="text-white/50 text-sm line-clamp-1">{selectedItemForMap.description}</p>
                </div>
                <Link
                  to={`/item/${selectedItemForMap.id}`}
                  className="px-6 py-3 backdrop-blur-xl bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all text-sm font-medium"
                  onClick={() => setShowMapModal(false)}
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
