import { useState } from 'react'
import { Upload, X, MapPin, Calendar, Tag, FileText, Image as ImageIcon, AlertCircle, CheckCircle2, Navigation, Crosshair } from 'lucide-react'
import LyceanSidebar from '@/components/lycean-sidebar'

const categories = ['Bags', 'Electronics', 'Jewelry', 'Accessories', 'Keys', 'Clothing', 'Books', 'Other']
const locations = [
  'Library - 1st Floor',
  'Library - 2nd Floor',
  'Cafeteria',
  'Gym',
  'Computer Lab',
  'Parking Lot',
  'Main Building',
  'Science Lab',
  'Auditorium',
  'Other'
]

export default function PostPage() {
  const [itemType, setItemType] = useState<'lost' | 'found'>('lost')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [locationCoords, setLocationCoords] = useState<{lat: number, lng: number} | null>(null)
  const [date, setDate] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [additionalDetails, setAdditionalDetails] = useState({
    color: '',
    brand: '',
    identifyingFeatures: ''
  })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)

  const handleMapClick = (locationName: string, coords: {lat: number, lng: number}) => {
    setLocation(locationName)
    setLocationCoords(coords)
    setShowMapModal(false)
  }

  const handleUseMyLocation = () => {
    // In real app, use geolocation API
    const mockLocation = {
      name: 'Current Location',
      coords: { lat: 14.8167, lng: 120.2833 }
    }
    setLocation(mockLocation.name)
    setLocationCoords(mockLocation.coords)
    setShowMapModal(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages([...images, ...newImages].slice(0, 4)) // Max 4 images
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmModal(true)
  }

  const confirmPost = () => {
    // Handle form submission
    console.log({
      itemType,
      title,
      description,
      category,
      location,
      date,
      images,
      additionalDetails
    })
    
    setShowConfirmModal(false)
    setShowSuccessToast(true)
    
    // Hide toast after 5 seconds
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 5000)
    
    // Reset form
    setTitle('')
    setDescription('')
    setCategory('')
    setLocation('')
    setDate('')
    setImages([])
    setAdditionalDetails({
      color: '',
      brand: '',
      identifyingFeatures: ''
    })
  }

  return (
    <>
      <LyceanSidebar />
      <main className="min-h-screen pt-6 lg:pt-12 pb-24 lg:pb-12 px-4 lg:px-6 lg:pl-80 lg:pr-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-5xl font-medium text-white mb-3 lg:mb-4">Post an Item</h1>
            <p className="text-white/60 text-base lg:text-lg">Help reunite lost items with their owners</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
            {/* Item Type Selection */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl">
              <h2 className="text-white font-medium text-lg lg:text-xl mb-4 lg:mb-6">What would you like to report?</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setItemType('lost')}
                  className={`p-6 lg:p-8 rounded-2xl border-2 transition-all ${
                    itemType === 'lost'
                      ? 'bg-red-500/20 border-red-500 shadow-lg shadow-red-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="text-4xl lg:text-5xl mb-3 lg:mb-4">😢</div>
                  <h3 className="text-white font-medium text-lg lg:text-xl mb-2">Lost Item</h3>
                  <p className="text-white/50 text-sm">I lost something</p>
                </button>

                <button
                  type="button"
                  onClick={() => setItemType('found')}
                  className={`p-6 lg:p-8 rounded-2xl border-2 transition-all ${
                    itemType === 'found'
                      ? 'bg-green-500/20 border-green-500 shadow-lg shadow-green-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="text-4xl lg:text-5xl mb-3 lg:mb-4">🎉</div>
                  <h3 className="text-white font-medium text-lg lg:text-xl mb-2">Found Item</h3>
                  <p className="text-white/50 text-sm">I found something</p>
                </button>
              </div>
            </div>

            {/* Image Upload - Priority Section */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-medium text-lg lg:text-xl flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Photos *
                </h2>
                <span className="text-white/50 text-sm">{images.length}/4</span>
              </div>

              {/* Upload Area */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-xl lg:rounded-2xl overflow-hidden group">
                    <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}

                {images.length < 4 && (
                  <label className="aspect-square rounded-xl lg:rounded-2xl border-2 border-dashed border-white/20 hover:border-[#ff7400]/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/5">
                    <Upload className="w-8 h-8 text-white/40 mb-2" />
                    <span className="text-white/40 text-sm">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 backdrop-blur-xl bg-[#ff7400]/10 border border-[#ff7400]/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-[#ff7400] flex-shrink-0 mt-0.5" />
                <p className="text-[#ff7400]/90 text-sm">
                  <strong>Important:</strong> Clear photos are essential for identification. Upload at least one photo from different angles.
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
              <h2 className="text-white font-medium text-lg lg:text-xl">Basic Information</h2>

              {/* Title */}
              <div>
                <label className="text-white/70 text-sm lg:text-base mb-2 block flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Item Name *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Blue Nike Backpack"
                  required
                  className="w-full px-4 py-3 lg:py-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 focus:bg-white/10 transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-white/70 text-sm lg:text-base mb-2 block">Category *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2.5 lg:py-3 rounded-xl text-sm lg:text-base font-medium transition-all ${
                        category === cat
                          ? 'bg-[#ff7400] text-white shadow-lg shadow-[#ff7400]/30'
                          : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-white/70 text-sm lg:text-base mb-2 block flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed description to help identify the item..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 lg:py-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 focus:bg-white/10 transition-all resize-none"
                />
                <p className="text-white/40 text-xs lg:text-sm mt-2">
                  Include details like size, color, brand, and any unique features
                </p>
              </div>
            </div>

            {/* Location & Date with Campus Map */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
              <h2 className="text-white font-medium text-lg lg:text-xl">Location & Date</h2>

              {/* Map Preview / Selector */}
              <div>
                <label className="text-white/70 text-sm lg:text-base mb-3 block flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Where was it {itemType === 'lost' ? 'lost' : 'found'}? *
                </label>
                
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="w-full aspect-[16/9] rounded-xl lg:rounded-2xl border-2 border-dashed border-white/20 hover:border-[#ff7400]/50 bg-gradient-to-br from-[#2f1632] to-[#1a0d1c] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/5 relative overflow-hidden group"
                >
                  {location ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#2f1632] to-[#1a0d1c] flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-[#ff7400]/20 border border-[#ff7400]/30 flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-[#ff7400]" />
                          </div>
                          <h4 className="text-white font-medium text-lg mb-2">{location}</h4>
                          {locationCoords && (
                            <p className="text-white/50 text-sm">
                              Lat: {locationCoords.lat}, Lng: {locationCoords.lng}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 px-4 py-2 bg-[#ff7400] text-white rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Change Location
                      </div>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-12 h-12 text-white/40 mb-3" />
                      <span className="text-white/60 text-base lg:text-lg font-medium mb-2">Click to Select Location</span>
                      <span className="text-white/40 text-sm">Mark the location on campus map</span>
                    </>
                  )}
                </button>
              </div>

              {/* Date */}
              <div>
                <label className="text-white/70 text-sm lg:text-base mb-2 block flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date {itemType === 'lost' ? 'Lost' : 'Found'} *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 lg:py-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl text-white focus:outline-none focus:border-[#ff7400]/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
              <h2 className="text-white font-medium text-lg lg:text-xl">Additional Details (Optional)</h2>

              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <label className="text-white/70 text-sm lg:text-base mb-2 block">Color</label>
                  <input
                    type="text"
                    value={additionalDetails.color}
                    onChange={(e) => setAdditionalDetails({...additionalDetails, color: e.target.value})}
                    placeholder="e.g., Blue, Red, Black"
                    className="w-full px-4 py-3 lg:py-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 focus:bg-white/10 transition-all"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm lg:text-base mb-2 block">Brand</label>
                  <input
                    type="text"
                    value={additionalDetails.brand}
                    onChange={(e) => setAdditionalDetails({...additionalDetails, brand: e.target.value})}
                    placeholder="e.g., Nike, Apple, Samsung"
                    className="w-full px-4 py-3 lg:py-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/70 text-sm lg:text-base mb-2 block">Identifying Features</label>
                <input
                  type="text"
                  value={additionalDetails.identifyingFeatures}
                  onChange={(e) => setAdditionalDetails({...additionalDetails, identifyingFeatures: e.target.value})}
                  placeholder="e.g., Scratches, stickers, unique marks"
                  className="w-full px-4 py-3 lg:py-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                className="flex-1 px-6 py-4 lg:py-5 backdrop-blur-xl bg-white/5 border border-white/10 text-white rounded-2xl lg:rounded-3xl hover:bg-white/10 transition-all text-base lg:text-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-4 lg:py-5 bg-[#ff7400] text-white rounded-2xl lg:rounded-3xl hover:bg-[#ff7400]/90 transition-all shadow-lg shadow-[#ff7400]/30 text-base lg:text-lg font-medium"
              >
                Post Item
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="backdrop-blur-xl bg-[#2f1632] border border-white/10 rounded-3xl p-6 lg:p-8 max-w-lg w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#ff7400]/10 border border-[#ff7400]/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-[#ff7400]" />
              </div>
              <h3 className="text-2xl font-medium text-white mb-3">Confirm Post</h3>
              <p className="text-white/60">
                Are you sure you want to post this {itemType} item?
              </p>
            </div>

            {/* Item Preview */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-4">
                {images[0] && (
                  <img
                    src={images[0]}
                    alt={title}
                    className="w-20 h-20 rounded-xl object-cover ring-2 ring-white/10"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                    itemType === 'lost'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-green-500/20 text-green-300 border border-green-500/30'
                  }`}>
                    {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                  </div>
                  <h4 className="text-white font-medium text-lg mb-1">{title}</h4>
                  <p className="text-white/50 text-sm line-clamp-2">{description}</p>
                  <div className="flex items-center gap-4 mt-2 text-white/40 text-xs">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {date}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-6 py-3 backdrop-blur-xl bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmPost}
                className="flex-1 px-6 py-3 bg-[#ff7400] text-white rounded-2xl font-medium hover:bg-[#ff7400]/90 transition-all shadow-lg shadow-[#ff7400]/30"
              >
                Confirm & Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-50 animate-slideIn">
          <div className="backdrop-blur-xl bg-green-500/20 border border-green-500/30 rounded-2xl p-4 shadow-2xl flex items-center gap-4 min-w-[320px]">
            <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium mb-1">Item Posted Successfully!</h4>
              <p className="text-green-300/80 text-sm">Your {itemType} item has been posted to the feed.</p>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      )}

      {/* Campus Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="backdrop-blur-xl bg-[#2f1632] border border-white/10 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 lg:p-8 border-b border-white/10">
              <div>
                <h3 className="text-2xl lg:text-3xl font-medium text-white mb-2">Select Location</h3>
                <p className="text-white/60 text-sm lg:text-base">Click on the map or use your current location</p>
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
              {/* Placeholder Interactive Map */}
              <div className="absolute inset-0 p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-[#ff7400]/10 border border-[#ff7400]/20 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-10 h-10 text-[#ff7400]" />
                  </div>
                  <h4 className="text-white text-xl font-medium mb-2">Lyceum of Subic Bay Campus</h4>
                  <p className="text-white/50 text-sm">Click on a location below to mark it</p>
                </div>

                {/* Location Buttons Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 max-w-4xl mx-auto">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => handleMapClick(loc, { lat: 14.8167 + Math.random() * 0.01, lng: 120.2833 + Math.random() * 0.01 })}
                      className="px-4 py-3 lg:py-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl text-white hover:bg-[#ff7400] hover:border-[#ff7400] transition-all text-sm lg:text-base font-medium flex items-center justify-center gap-2 group"
                    >
                      <MapPin className="w-4 h-4 text-white/60 group-hover:text-white" />
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Use My Location Button */}
              <div className="absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2">
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  className="px-6 lg:px-8 py-3 lg:py-4 bg-[#ff7400] text-white rounded-xl lg:rounded-2xl font-medium hover:bg-[#ff7400]/90 transition-all shadow-lg shadow-[#ff7400]/30 flex items-center gap-3"
                >
                  <Crosshair className="w-5 h-5" />
                  Use My Current Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
