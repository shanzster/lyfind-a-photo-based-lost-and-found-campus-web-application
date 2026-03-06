import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Share2, MessageCircle, CheckCircle, Loader2, Image as ImageIcon } from 'lucide-react'
import LyceanSidebar from '@/components/lycean-sidebar'
import { itemService, Item } from '@/services/itemService'
import { userService } from '@/services/userService'
import { messageService } from '@/services/messageService'
import { useAuth } from '@/contexts/AuthContext'
import { getFloorPlan } from '@/lib/floorPlans'
import { toast } from 'sonner'

// Helper function to format timestamp
const formatTimestamp = (timestamp: any) => {
  if (!timestamp) return 'Unknown'
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
  return date.toLocaleDateString()
}

export default function ItemPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [creatingConversation, setCreatingConversation] = useState(false)

  // Get the return path from location state
  const returnPath = (location.state as any)?.from || '/browse';

  // Fetch item data
  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        toast.error('Invalid item ID')
        navigate('/browse')
        return
      }

      try {
        setLoading(true)
        console.log('[Item] Fetching item:', id)
        const fetchedItem = await itemService.getItemById(id)
        
        if (!fetchedItem) {
          toast.error('Item not found')
          navigate('/browse')
          return
        }

        // Fetch user photo if not available
        if (!fetchedItem.userPhotoURL && fetchedItem.userId) {
          try {
            const userProfile = await userService.getUserProfile(fetchedItem.userId)
            fetchedItem.userPhotoURL = userProfile?.photoURL
          } catch (error) {
            console.error('[Item] Error fetching user photo:', error)
          }
        }

        console.log('[Item] Item loaded:', fetchedItem)
        setItem(fetchedItem)
      } catch (error: any) {
        console.error('[Item] Error fetching item:', error)
        toast.error('Failed to load item')
        navigate('/browse')
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id, navigate])

  const handleSendMessage = async () => {
    if (!user || !item) return

    setCreatingConversation(true)
    try {
      // Get item owner's profile
      const ownerProfile = await userService.getUserProfile(item.userId)
      
      if (!ownerProfile) {
        toast.error('Could not find item owner')
        return
      }

      // Create or get conversation
      const conversationId = await messageService.createConversation(
        item.id!,
        item.title,
        item.photos?.[0] || '/placeholder.svg',
        item.type,
        item.userId,
        ownerProfile.displayName,
        user.uid,
        user.displayName || 'User',
        user.photoURL || undefined,
        ownerProfile.photoURL || undefined
      )

      // Navigate to messages page
      navigate('/messages', { state: { conversationId } })
      toast.success('Conversation started!')
    } catch (error) {
      console.error('Error creating conversation:', error)
      toast.error('Failed to start conversation')
    } finally {
      setCreatingConversation(false)
    }
  }

  if (loading) {
    return (
      <>
        <LyceanSidebar />
        <main className="min-h-screen pt-6 lg:pt-12 pb-24 lg:pb-12 px-4 lg:px-6 lg:pl-80 lg:pr-12">
          <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#ff7400] animate-spin mx-auto mb-4" />
              <p className="text-white/60 text-lg">Loading item...</p>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!item) {
    return null
  }

  return (
    <>
      <LyceanSidebar />
      <main className="min-h-screen pt-6 lg:pt-12 pb-24 lg:pb-12 px-4 lg:px-6 lg:pl-80 lg:pr-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Back Button */}
          <Link 
            to={returnPath}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 lg:mb-10 transition-colors group"
          >
            <ArrowLeft className="w-4 lg:w-5 h-4 lg:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm lg:text-base font-medium">
              {returnPath === '/photo-match' ? 'Back to Photo Match' : 'Back to Browse'}
            </span>
          </Link>

          <div className="grid lg:grid-cols-[1fr,1fr] gap-6 lg:gap-10 xl:gap-12">
            {/* Left Column - Images & Map */}
            <div className="space-y-6 lg:space-y-8">
              {/* Images Section */}
              <div className="space-y-4 lg:space-y-6">
                {/* Main Image */}
                <div className="relative aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
                  {item.photos && item.photos.length > 0 ? (
                    <img
                      src={item.photos[selectedImage]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5">
                      <ImageIcon className="w-24 h-24 text-white/20" />
                    </div>
                  )}
                  
                  {/* Type Badge */}
                  <div className={`absolute top-4 lg:top-6 left-4 lg:left-6 px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium backdrop-blur-md shadow-lg ${
                    item.type === 'lost'
                      ? 'bg-red-500/90 text-white'
                      : 'bg-green-500/90 text-white'
                  }`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 lg:top-6 right-4 lg:right-6 px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium backdrop-blur-md shadow-lg bg-green-500/90 text-white">
                    {item.status === 'active' ? 'Active' : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </div>
                </div>

                {/* Thumbnail Images */}
                {item.photos && item.photos.length > 1 && (
                  <div className="grid grid-cols-4 gap-3 lg:gap-4">
                    {item.photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-xl lg:rounded-2xl overflow-hidden backdrop-blur-xl border-2 transition-all ${
                          selectedImage === index
                            ? 'border-[#ff7400] shadow-lg shadow-[#ff7400]/30'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`${item.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Map Section */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl">
                <h3 className="text-white font-medium text-lg lg:text-xl mb-4 lg:mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#ff7400]" />
                  Location
                </h3>
                <div className="aspect-video rounded-xl lg:rounded-2xl overflow-hidden bg-gradient-to-br from-[#2f1632] to-[#1a0d1c] relative">
                  {item.floorPlanId && item.locationX !== undefined && item.locationY !== undefined ? (
                    // Show floor plan with pinned location
                    <>
                      <img
                        src={getFloorPlan(item.floorPlanId)?.imageUrl || '/floor-plans/ground_floor.png'}
                        alt="Floor Plan"
                        className="w-full h-full object-contain"
                      />
                      
                      {/* Pinned Location Marker */}
                      <div
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 animate-bounce"
                        style={{
                          left: `${item.locationX}%`,
                          top: `${item.locationY}%`,
                        }}
                      >
                        <div className="relative">
                          {/* Pulsing ring */}
                          <div className="absolute inset-0 rounded-full bg-[#ff7400] animate-ping opacity-75"></div>
                          {/* Main marker */}
                          <div className="relative w-10 h-10 rounded-full bg-[#ff7400] border-4 border-white shadow-2xl flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Room label overlay */}
                      {item.roomNumber && (
                        <div className="absolute bottom-4 left-4 right-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-3">
                          <p className="text-white font-medium text-sm">{item.roomNumber}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    // Fallback if no floor plan location
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-[#ff7400] mx-auto mb-3" />
                        <p className="text-white font-medium text-lg">{item.location.address || 'Campus Location'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6 lg:space-y-8">
              {/* Title & Category */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-4xl font-medium text-white mb-3">{item.title}</h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-white/80">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-white/50 text-sm">
                        <Clock className="w-4 h-4" />
                        {formatTimestamp(item.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-white font-medium text-lg mb-3">Description</h3>
                  <p className="text-white/70 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* User Info */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl">
                <h3 className="text-white font-medium text-lg mb-4">Posted By</h3>
                <div className="flex items-center gap-4">
                  {item.userPhotoURL ? (
                    <img
                      src={item.userPhotoURL}
                      alt={item.userName}
                      className="w-16 h-16 rounded-full bg-white/10 ring-2 ring-white/20 object-cover"
                      onError={(e) => {
                        // Fallback to UI Avatars if image fails to load
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userName)}&background=ff7400&color=fff&size=128`;
                      }}
                    />
                  ) : (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.userName)}&background=ff7400&color=fff&size=128`}
                      alt={item.userName}
                      className="w-16 h-16 rounded-full bg-white/10 ring-2 ring-white/20 object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-lg">{item.userName}</h4>
                    <p className="text-white/50 text-sm">{item.userEmail}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {user && user.uid !== item.userId ? (
                    <button
                      onClick={handleSendMessage}
                      disabled={creatingConversation}
                      className="w-full px-6 py-4 bg-[#ff7400] text-white rounded-2xl font-medium hover:bg-[#ff7400]/90 transition-all shadow-lg shadow-[#ff7400]/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {creatingConversation ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Starting conversation...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-5 h-5" />
                          Message Owner
                        </>
                      )}
                    </button>
                  ) : (
                    <>
                      {item.status === 'active' && (
                        <button
                          onClick={() => {
                            toast.success('Item marked as resolved!')
                            // TODO: Update item status in Firestore
                          }}
                          className="w-full px-6 py-4 bg-green-500 text-white rounded-2xl font-medium hover:bg-green-500/90 transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Mark as Resolved
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const publicUrl = `${window.location.origin}/public/item/${item.id}`
                          navigator.clipboard.writeText(publicUrl)
                          toast.success('Public link copied to clipboard!')
                        }}
                        className="w-full px-6 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-white rounded-2xl font-medium hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-5 h-5" />
                        Share Item
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Location Details */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl">
                <h3 className="text-white font-medium text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#ff7400]" />
                  Location Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-white/50 text-sm mb-1">Location</p>
                    <p className="text-white">{item.location.address || 'Campus Location'}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Date {item.type === 'lost' ? 'Lost' : 'Found'}</p>
                    <p className="text-white">{formatTimestamp(item.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
