import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Eye, Share2, Flag, Calendar, MessageCircle, X, CheckCircle } from 'lucide-react'
import LyceanSidebar from '@/components/lycean-sidebar'

// Mock data - in real app, this would come from API
const mockItem = {
  id: 1,
  title: 'Blue Nike Backpack',
  category: 'Bags',
  type: 'lost',
  location: 'Library - 2nd Floor',
  locationDetails: 'Found near the study area, close to the computer section',
  coordinates: { lat: 14.8167, lng: 120.2833 }, // LSB approximate coordinates
  date: '2 hours ago',
  datePosted: 'February 10, 2026',
  images: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&h=600&fit=crop'
  ],
  description: 'Lost blue Nike backpack with laptop inside. Has a small tear on the front pocket. The backpack contains important documents and a MacBook Pro. If found, please contact me immediately. There is also a small keychain attached with my initials "AM".',
  user: {
    name: 'Alex Martinez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    studentId: '2021-12345',
    course: 'BS Computer Science'
  },
  views: 124,
  status: 'claimed', // 'active' or 'claimed'
  claimedBy: {
    name: 'Maria Santos',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    studentId: '2021-67890',
    course: 'BS Information Technology',
    claimedDate: 'February 11, 2026'
  },
  additionalDetails: {
    color: 'Blue',
    brand: 'Nike',
    condition: 'Good (small tear)',
    identifyingFeatures: 'Small tear on front pocket, "AM" keychain attached'
  }
}

export default function ItemPage() {
  const { id } = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [message, setMessage] = useState('')

  const item = mockItem // In real app: fetch based on id

  const handleSendMessage = () => {
    // Handle message sending
    console.log('Sending message:', message)
    setShowMessageModal(false)
    setMessage('')
  }

  return (
    <>
      <LyceanSidebar />
      <main className="min-h-screen pt-6 lg:pt-12 pb-24 lg:pb-12 px-4 lg:px-6 lg:pl-80 lg:pr-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Back Button */}
          <Link 
            to="/browse"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 lg:mb-10 transition-colors group"
          >
            <ArrowLeft className="w-4 lg:w-5 h-4 lg:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm lg:text-base font-medium">Back to Browse</span>
          </Link>

          <div className="grid lg:grid-cols-[1fr,1fr] gap-6 lg:gap-10 xl:gap-12">
            {/* Left Column - Images & Map */}
            <div className="space-y-6 lg:space-y-8">
              {/* Images Section */}
              <div className="space-y-4 lg:space-y-6">
                {/* Main Image */}
                <div className="relative aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
                  <img
                    src={item.images[selectedImage]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Type Badge */}
                  <div className={`absolute top-4 lg:top-6 left-4 lg:left-6 px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium backdrop-blur-md shadow-lg ${
                    item.type === 'lost'
                      ? 'bg-red-500/90 text-white'
                      : 'bg-green-500/90 text-white'
                  }`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </div>

                  {/* Status Badge */}
                  <div className={`absolute top-4 lg:top-6 right-4 lg:right-6 px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium backdrop-blur-md shadow-lg ${
                    item.status === 'claimed'
                      ? 'bg-green-500/90 text-white'
                      : 'bg-[#ff7400]/90 text-white'
                  }`}>
                    {item.status === 'claimed' ? 'Claimed' : 'Active'}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-4 gap-3 lg:gap-4">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-xl lg:rounded-2xl overflow-hidden transition-all ${
                        selectedImage === index
                          ? 'ring-2 lg:ring-3 ring-[#ff7400] scale-105 shadow-lg shadow-[#ff7400]/30'
                          : 'ring-1 ring-white/10 hover:ring-white/30 hover:scale-105'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${item.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Campus Map Section */}
              <div>
                <h2 className="text-xl lg:text-2xl font-medium text-white mb-4 lg:mb-6">Location on Campus</h2>
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
                  {/* Map Container */}
                  <div className="relative h-[250px] lg:h-[400px] bg-gradient-to-br from-[#2f1632] to-[#1a0d1c]">
                    {/* Placeholder Map */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center px-4">
                        <div className="w-16 lg:w-20 h-16 lg:h-20 rounded-full bg-[#ff7400]/10 border border-[#ff7400]/20 flex items-center justify-center mx-auto mb-4">
                          <MapPin className="w-8 lg:w-10 h-8 lg:h-10 text-[#ff7400]" />
                        </div>
                        <h3 className="text-white text-lg lg:text-xl font-medium mb-2">Campus Map</h3>
                        <p className="text-white/50 text-sm lg:text-base mb-4">{item.location}</p>
                        <div className="inline-flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl text-white text-xs lg:text-sm">
                          <MapPin className="w-4 h-4 text-[#ff7400]" />
                          <span>Lat: {item.coordinates.lat}, Lng: {item.coordinates.lng}</span>
                        </div>
                      </div>
                    </div>

                    {/* Map Overlay */}
                    <div className="absolute bottom-3 lg:bottom-4 left-3 lg:left-4 right-3 lg:right-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl lg:rounded-2xl p-3 lg:p-5">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-xl bg-[#ff7400] flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm lg:text-base mb-1 truncate">{item.location}</h4>
                          <p className="text-white/60 text-xs lg:text-sm line-clamp-1">{item.locationDetails}</p>
                        </div>
                        <button className="px-4 lg:px-6 py-2 lg:py-3 bg-[#ff7400] text-white rounded-lg lg:rounded-xl text-xs lg:text-sm font-medium hover:bg-[#ff7400]/90 transition-all whitespace-nowrap">
                          Directions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6 lg:space-y-8">
              {/* Title & Category */}
              <div>
                <div className="flex items-center gap-3 mb-3 lg:mb-4">
                  <span className="px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium bg-white/10 text-white/70 border border-white/10">
                    {item.category}
                  </span>
                  <span className="text-white/40 text-sm lg:text-base flex items-center gap-2">
                    <Eye className="w-4 lg:w-5 h-4 lg:h-5" />
                    {item.views} views
                  </span>
                </div>
                <h1 className="text-3xl lg:text-5xl font-medium text-white mb-4 lg:mb-6 leading-tight">
                  {item.title}
                </h1>
                <p className="text-white/60 text-base lg:text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Quick Info */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-5 lg:p-8 space-y-5 lg:space-y-6 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#ff7400]/10 border border-[#ff7400]/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#ff7400]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium text-lg mb-1">{item.location}</div>
                    <div className="text-white/50 text-sm lg:text-base">{item.locationDetails}</div>
                  </div>
                </div>

                <div className="h-px bg-white/10"></div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#ff7400]/10 border border-[#ff7400]/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#ff7400]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium text-lg">{item.date}</div>
                    <div className="text-white/50 text-sm lg:text-base">Posted on {item.datePosted}</div>
                  </div>
                </div>

                <div className="h-px bg-white/10"></div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#ff7400]/10 border border-[#ff7400]/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-[#ff7400]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium text-lg">Status</div>
                    <div className="text-white/50 text-sm lg:text-base">Still {item.type}</div>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-5 lg:p-8 shadow-xl">
                <h3 className="text-white font-medium text-lg lg:text-xl mb-5 lg:mb-6">Additional Details</h3>
                <div className="space-y-4">
                  {Object.entries(item.additionalDetails).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start gap-4 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                      <span className="text-white/50 text-sm lg:text-base capitalize font-medium">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-white text-sm lg:text-base text-right max-w-[60%]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posted By & Claimed By Combined */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-5 lg:p-8 shadow-xl space-y-6 lg:space-y-8">
                {/* Posted By */}
                <div>
                  <h3 className="text-white font-medium text-lg lg:text-xl mb-4 lg:mb-5">Posted By</h3>
                  <div className="flex items-center gap-4 lg:gap-5">
                    <img
                      src={item.user.avatar}
                      alt={item.user.name}
                      className="w-14 lg:w-16 h-14 lg:h-16 rounded-full bg-white/10 ring-2 ring-white/10"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium text-base lg:text-lg">{item.user.name}</div>
                      <div className="text-white/50 text-sm">{item.user.studentId}</div>
                      <div className="text-white/40 text-sm">{item.user.course}</div>
                    </div>
                  </div>
                </div>

                {/* Claimed By Section - Only show if item is claimed */}
                {item.status === 'claimed' && item.claimedBy && (
                  <>
                    <div className="h-px bg-white/10"></div>
                    <div>
                      <div className="flex items-center gap-2 mb-4 lg:mb-5">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <h3 className="text-green-300 font-medium text-lg lg:text-xl">Claimed By</h3>
                      </div>
                      <div className="flex items-center gap-4 lg:gap-5">
                        <img
                          src={item.claimedBy.avatar}
                          alt={item.claimedBy.name}
                          className="w-14 lg:w-16 h-14 lg:h-16 rounded-full bg-white/10 ring-2 ring-green-500/30"
                        />
                        <div className="flex-1">
                          <div className="text-white font-medium text-base lg:text-lg">{item.claimedBy.name}</div>
                          <div className="text-white/50 text-sm">{item.claimedBy.studentId}</div>
                          <div className="text-white/40 text-sm">{item.claimedBy.course}</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-green-500/20">
                        <div className="flex items-center gap-2 text-green-300/70 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>Claimed on {item.claimedBy.claimedDate}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 lg:gap-4">
                <button
                  onClick={() => setShowMessageModal(true)}
                  disabled={item.status === 'claimed'}
                  className={`flex-1 px-6 lg:px-8 py-4 lg:py-5 rounded-2xl lg:rounded-3xl font-medium text-base lg:text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${
                    item.status === 'claimed'
                      ? 'bg-white/5 text-white/40 cursor-not-allowed border border-white/10'
                      : 'bg-[#ff7400] text-white hover:bg-[#ff7400]/90 hover:scale-105 shadow-[#ff7400]/30'
                  }`}
                >
                  <MessageCircle className="w-5 lg:w-6 h-5 lg:h-6" />
                  {item.status === 'claimed' ? 'Item Claimed' : 'Message Poster'}
                </button>
                <button className="px-6 lg:px-8 py-4 lg:py-5 backdrop-blur-xl bg-white/5 border border-white/10 text-white rounded-2xl lg:rounded-3xl hover:bg-white/10 hover:scale-105 transition-all shadow-xl">
                  <Share2 className="w-5 lg:w-6 h-5 lg:h-6" />
                </button>
                <button className="px-6 lg:px-8 py-4 lg:py-5 backdrop-blur-xl bg-white/5 border border-white/10 text-white rounded-2xl lg:rounded-3xl hover:bg-white/10 hover:scale-105 transition-all shadow-xl">
                  <Flag className="w-5 lg:w-6 h-5 lg:h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="backdrop-blur-xl bg-[#2f1632] border border-white/10 rounded-3xl p-6 lg:p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-medium text-white">Send Message</h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="w-10 h-10 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 mb-6 p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
              <img
                src={item.user.avatar}
                alt={item.user.name}
                className="w-12 h-12 rounded-full bg-white/10 ring-2 ring-white/10"
              />
              <div>
                <div className="text-white font-medium">{item.user.name}</div>
                <div className="text-white/50 text-sm">{item.user.course}</div>
              </div>
            </div>

            {/* Message Input */}
            <div className="mb-6">
              <label className="text-white/70 text-sm mb-2 block">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I think I found your item..."
                rows={6}
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 focus:bg-white/10 transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 px-6 py-3 backdrop-blur-xl bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="flex-1 px-6 py-3 bg-[#ff7400] text-white rounded-2xl font-medium hover:bg-[#ff7400]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#ff7400]/30"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
