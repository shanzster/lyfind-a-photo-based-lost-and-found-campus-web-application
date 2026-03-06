import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Send, ArrowLeft, Loader2, MessageCircle, Package, Flag, X, AlertTriangle, Paperclip, MapPin, CheckCircle } from 'lucide-react';
import LyceanSidebar from '@/components/lycean-sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { messageService, Conversation, Message } from '@/services/messageService';
import { reportService } from '@/services/reportService';
import { storageService } from '@/services/storageService';
// import { itemService } from '@/services/itemService';
import { floorPlans, getFloorPlan } from '@/lib/floorPlans';
import { toast } from 'sonner';

export default function MessagesPage() {
  const { user, userProfile } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportCategory, setReportCategory] = useState<'inappropriate' | 'spam' | 'fraud' | 'harassment' | 'other'>('harassment');
  const [reportDescription, setReportDescription] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [meetupLocation, setMeetupLocation] = useState('');
  const [claimingItem, setClaimingItem] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(floorPlans[0].id);
  const [locationPin, setLocationPin] = useState<{ x: number; y: number } | null>(null);
  const [roomNumber, setRoomNumber] = useState('');

  // Get conversation ID from navigation state
  const targetConversationId = (location.state as any)?.conversationId;

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = messageService.listenToUserConversations(
      user.uid,
      (convs) => {
        setConversations(convs);
        setLoading(false);

        // Auto-select conversation if passed via navigation
        if (targetConversationId && !selectedConversation) {
          const targetConv = convs.find(c => c.id === targetConversationId);
          if (targetConv) {
            setSelectedConversation(targetConv);
            setShowMobileChat(true);
          }
        }
      }
    );

    return () => unsubscribe();
  }, [user, targetConversationId]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const unsubscribe = messageService.listenToMessages(
      selectedConversation.id!,
      (msgs) => {
        setMessages(msgs);
      }
    );

    // Mark as read
    if (user) {
      messageService.markAsRead(selectedConversation.id!, user.uid);
    }

    return () => unsubscribe();
  }, [selectedConversation, user]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && selectedImages.length === 0 && !locationPin) || !selectedConversation || !user) return;

    setSending(true);
    try {
      let imageUrls: string[] = [];
      
      // Upload images if any
      if (selectedImages.length > 0) {
        setUploadingImages(true);
        imageUrls = await storageService.uploadItemPhotos(selectedImages);
        setUploadingImages(false);
      }

      // Prepare location data if pin is set
      let locationData: { floorPlanId: string; x: number; y: number; roomNumber?: string } | undefined;
      if (locationPin) {
        locationData = {
          floorPlanId: selectedFloorPlan,
          x: locationPin.x,
          y: locationPin.y,
          roomNumber: roomNumber || undefined,
        };
      }

      await messageService.sendMessage(
        selectedConversation.id!,
        user.uid,
        user.displayName || 'User',
        newMessage.trim() || (locationPin ? '📍 Location' : '📷 Image'),
        user.photoURL || undefined,
        imageUrls.length > 0 ? imageUrls : undefined,
        locationData
      );
      
      setNewMessage('');
      setSelectedImages([]);
      setLocationPin(null);
      setRoomNumber('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
      setUploadingImages(false);
    }
  };

  const handleReportConversation = async () => {
    if (!user || !userProfile || !selectedConversation) {
      toast.error('Please log in to report')
      return
    }

    if (!reportDescription.trim()) {
      toast.error('Please provide a description')
      return
    }

    setSubmittingReport(true)

    try {
      const otherUser = getOtherParticipant(selectedConversation);
      
      const reportData: any = {
        reportedBy: user.uid,
        reporterName: userProfile.displayName || user.displayName || 'User',
        reporterEmail: user.email!,
        reason: reportCategory,
        category: reportCategory,
        description: reportDescription.trim()
      };

      // Add optional fields only if they exist
      if (selectedConversation.id) {
        reportData.conversationId = selectedConversation.id;
      }
      if (selectedConversation.itemTitle) {
        reportData.messageContent = `Conversation about: ${selectedConversation.itemTitle}`;
      }
      if (otherUser.id) {
        reportData.reportedUserId = otherUser.id;
      }
      if (otherUser.name) {
        reportData.reportedUserName = otherUser.name;
      }
      
      await reportService.createReport(reportData);

      toast.success('Report submitted successfully')
      setShowReportModal(false)
      setReportCategory('harassment')
      setReportDescription('')
    } catch (error) {
      console.error('Error submitting report:', error)
      toast.error('Failed to submit report')
    } finally {
      setSubmittingReport(false)
    }
  };

  const handleClaimItem = async () => {
    if (!user || !selectedConversation || !meetupLocation.trim()) {
      toast.error('Please provide a meetup location');
      return;
    }

    setClaimingItem(true);
    try {
      await messageService.markItemAsClaimed(
        selectedConversation.id!,
        selectedConversation.itemId,
        user.uid,
        { name: meetupLocation.trim() }
      );

      toast.success('Item marked as claimed!');
      setShowClaimModal(false);
      setMeetupLocation('');
    } catch (error) {
      console.error('Error claiming item:', error);
      toast.error('Failed to mark item as claimed');
    } finally {
      setClaimingItem(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setSelectedImages([...selectedImages, ...files]);
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleFloorPlanClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLocationPin({ x, y });
  };

  const handleSendLocation = () => {
    if (!locationPin) {
      toast.error('Please select a location on the map');
      return;
    }
    setShowLocationModal(false);
    // Location will be sent when user clicks send button
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setShowMobileChat(true);
  };

  const getOtherParticipant = (conv: Conversation) => {
    const otherUserId = conv.participants.find((id) => id !== user?.uid);
    return {
      id: otherUserId,
      name: conv.participantNames[otherUserId!],
      photo: conv.participantPhotos[otherUserId!],
    };
  };

  if (!user) {
    return (
      <>
        <LyceanSidebar />
        <main className="min-h-screen pt-6 lg:pt-12 pb-24 lg:pb-12 px-4 lg:px-6 lg:pl-80 lg:pr-12">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
              <MessageCircle className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
              <p className="text-white/60 mb-6">Please sign in to view your messages</p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-[#ff7400] hover:bg-[#ff8500] text-white font-medium rounded-xl transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <LyceanSidebar />

      <main className="min-h-screen pt-0 pb-0 lg:pl-80 bg-[#2f1632]">
        <div className="h-screen flex">
          {/* Conversations List - Left Sidebar */}
          <div
            className={`${
              showMobileChat ? 'hidden lg:flex' : 'flex'
            } w-full lg:w-96 flex-col border-r border-white/10 bg-[#2f1632]`}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <h1 className="text-2xl font-bold text-white mb-1">Messages</h1>
              <p className="text-white/60 text-sm">
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
                  <MessageCircle className="w-12 h-12 text-white/40 mb-4" />
                  <p className="text-white/60 mb-2">No messages yet</p>
                  <p className="text-white/40 text-sm">
                    Start a conversation by clicking "Message" on an item
                  </p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const otherUser = getOtherParticipant(conv);
                  const unreadCount = conv.unreadCount[user.uid] || 0;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`w-full p-4 border-b border-white/10 hover:bg-white/5 transition-colors text-left ${
                        selectedConversation?.id === conv.id ? 'bg-white/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {otherUser.photo ? (
                            <img
                              src={otherUser.photo}
                              alt={otherUser.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to UI Avatars if image fails to load
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}&background=ff7400&color=fff&size=128`;
                              }}
                            />
                          ) : (
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}&background=ff7400&color=fff&size=128`}
                              alt={otherUser.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-white truncate">
                              {otherUser.name}
                            </p>
                            {unreadCount > 0 && (
                              <span className="ml-2 px-2 py-0.5 bg-[#ff7400] text-white text-xs font-bold rounded-full">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-white/60 mb-1 truncate">
                            Re: {conv.itemTitle}
                          </p>
                          {conv.lastMessage && (
                            <p className="text-sm text-white/40 truncate">
                              {conv.lastMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area - Right Side */}
          <div className={`${showMobileChat ? 'flex' : 'hidden lg:flex'} flex-1 flex-col`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 bg-[#2f1632]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowMobileChat(false)}
                      className="lg:hidden text-white/60 hover:text-white"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                      {getOtherParticipant(selectedConversation).photo ? (
                        <img
                          src={getOtherParticipant(selectedConversation).photo}
                          alt={getOtherParticipant(selectedConversation).name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to UI Avatars if image fails to load
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getOtherParticipant(selectedConversation).name)}&background=ff7400&color=fff&size=128`;
                          }}
                        />
                      ) : (
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(getOtherParticipant(selectedConversation).name)}&background=ff7400&color=fff&size=128`}
                          alt={getOtherParticipant(selectedConversation).name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-white">
                        {getOtherParticipant(selectedConversation).name}
                      </p>
                      <p className="text-sm text-white/60">
                        Inquiring about item
                      </p>
                    </div>

                    <button
                      onClick={() => setShowReportModal(true)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-all"
                      title="Report conversation"
                    >
                      <Flag className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Item Card */}
                <div className="p-4 border-b border-white/10 bg-white/5">
                  <Link
                    to={`/item/${selectedConversation.itemId}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                  >
                    <img
                      src={selectedConversation.itemImage}
                      alt={selectedConversation.itemTitle}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-white/60" />
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-lg ${
                            selectedConversation.itemType === 'lost'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-green-500/20 text-green-300'
                          }`}
                        >
                          {selectedConversation.itemType === 'lost' ? 'Lost' : 'Found'}
                        </span>
                      </div>
                      <p className="font-semibold text-white truncate">
                        {selectedConversation.itemTitle}
                      </p>
                      <p className="text-xs text-white/60">Click to view item details</p>
                    </div>
                  </Link>

                  {/* Claim Button - Only show to item owner */}
                  {selectedConversation.participants[0] === user.uid && (
                    <button
                      onClick={() => setShowClaimModal(true)}
                      className="w-full mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Claimed
                    </button>
                  )}
                </div>

                {/* Admin Monitoring Disclaimer */}
                <div className="px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20">
                  <p className="text-yellow-200/90 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" />
                    Admin monitors all conversations for safety and security
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.senderId === user.uid;
                    const isSystem = message.senderId === 'system';

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isSystem ? 'justify-center' : isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`${isSystem ? 'max-w-md' : 'max-w-xs lg:max-w-md'} px-4 py-3 rounded-2xl ${
                            isSystem
                              ? 'bg-blue-500/20 text-blue-200 text-center text-sm'
                              : isOwn
                              ? 'bg-[#ff7400] text-white'
                              : 'bg-white/10 text-white'
                          }`}
                        >
                          {message.content && <p className="text-sm break-words">{message.content}</p>}
                          
                          {/* Display images if any */}
                          {message.images && message.images.length > 0 && (
                            <div className={`grid gap-2 ${message.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} ${message.content ? 'mt-2' : ''}`}>
                              {message.images.map((imageUrl, idx) => (
                                <img
                                  key={idx}
                                  src={imageUrl}
                                  alt={`Attachment ${idx + 1}`}
                                  className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(imageUrl, '_blank')}
                                />
                              ))}
                            </div>
                          )}

                          {/* Display location if any */}
                          {message.location && (
                            <div className={`${message.content || message.images ? 'mt-2' : ''}`}>
                              <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1a0d1c] border border-white/10">
                                <img
                                  src={getFloorPlan(message.location.floorPlanId)?.imageUrl || '/floor-plans/ground_floor.png'}
                                  alt="Floor Plan"
                                  className="w-full h-full object-contain"
                                />
                                {/* Location Pin */}
                                <div
                                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 animate-bounce"
                                  style={{
                                    left: `${message.location.x}%`,
                                    top: `${message.location.y}%`,
                                  }}
                                >
                                  <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-[#ff7400] animate-ping opacity-75"></div>
                                    <div className="relative w-8 h-8 rounded-full bg-[#ff7400] border-2 border-white shadow-2xl flex items-center justify-center">
                                      <MapPin className="w-4 h-4 text-white" />
                                    </div>
                                  </div>
                                </div>
                                {/* Room label */}
                                {message.location.roomNumber && (
                                  <div className="absolute bottom-2 left-2 right-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-2">
                                    <p className="text-white font-medium text-xs text-center">{message.location.roomNumber}</p>
                                  </div>
                                )}
                              </div>
                              <p className="text-xs mt-1 opacity-70">
                                📍 {getFloorPlan(message.location.floorPlanId)?.name || 'Campus Location'}
                              </p>
                            </div>
                          )}
                          
                          {!isSystem && (
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? 'text-white/70' : 'text-white/50'
                              }`}
                            >
                              {message.createdAt.toDate().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-white/10 bg-[#2f1632]">
                  {/* Image Previews */}
                  {selectedImages.length > 0 && (
                    <div className="mb-3 flex gap-2 flex-wrap">
                      {selectedImages.map((file, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx + 1}`}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <button
                            onClick={() => removeSelectedImage(idx)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Location Preview */}
                  {locationPin && (
                    <div className="mb-3">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1a0d1c] border border-[#ff7400]/50">
                        <img
                          src={getFloorPlan(selectedFloorPlan)?.imageUrl || '/floor-plans/ground_floor.png'}
                          alt="Floor Plan"
                          className="w-full h-full object-contain"
                        />
                        <div
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                          style={{
                            left: `${locationPin.x}%`,
                            top: `${locationPin.y}%`,
                          }}
                        >
                          <div className="w-6 h-6 rounded-full bg-[#ff7400] border-2 border-white shadow-lg flex items-center justify-center">
                            <MapPin className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setLocationPin(null);
                            setRoomNumber('');
                          }}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                        {roomNumber && (
                          <div className="absolute bottom-2 left-2 right-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-1">
                            <p className="text-white font-medium text-xs text-center">{roomNumber}</p>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-white/60 mt-1">📍 {getFloorPlan(selectedFloorPlan)?.name}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {/* Image Upload Button */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={sending || uploadingImages}
                      className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                      title="Attach images"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>

                    {/* Location Pin Button */}
                    <button
                      onClick={() => setShowLocationModal(true)}
                      disabled={sending || uploadingImages}
                      className={`p-3 border rounded-xl transition-all disabled:opacity-50 ${
                        locationPin
                          ? 'bg-[#ff7400] border-[#ff7400] text-white'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                      title="Share location"
                    >
                      <MapPin className="w-5 h-5" />
                    </button>

                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      disabled={sending || uploadingImages}
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 transition-all disabled:opacity-50"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={(!newMessage.trim() && selectedImages.length === 0 && !locationPin) || sending || uploadingImages}
                      className="px-6 py-3 bg-[#ff7400] hover:bg-[#ff8500] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {sending || uploadingImages ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60 mb-2">Select a conversation</p>
                  <p className="text-white/40 text-sm">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Report Modal */}
      {showReportModal && selectedConversation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="backdrop-blur-xl bg-[#2f1632] border border-white/10 rounded-3xl max-w-lg w-full shadow-2xl my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 lg:p-8 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Flag className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-medium text-white">Report Conversation</h3>
                  <p className="text-white/60 text-sm">Report inappropriate behavior</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowReportModal(false)
                  setReportCategory('harassment')
                  setReportDescription('')
                }}
                disabled={submittingReport}
                className="w-10 h-10 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="p-6 lg:p-8 space-y-6 overflow-y-auto flex-1">
              {/* Conversation Preview */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <img
                  src={selectedConversation.itemImage}
                  alt={selectedConversation.itemTitle}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{selectedConversation.itemTitle}</h4>
                  <p className="text-white/50 text-sm truncate">
                    With: {getOtherParticipant(selectedConversation).name}
                  </p>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-200/90 text-sm">
                  False reports may result in account suspension. Please only report genuine violations.
                </p>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-white/70 text-sm mb-3 font-medium">
                  Reason for Report
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'harassment', label: 'Harassment', desc: 'Threatening or abusive messages' },
                    { value: 'spam', label: 'Spam', desc: 'Unwanted or repetitive messages' },
                    { value: 'fraud', label: 'Scam/Fraud', desc: 'Attempting to scam or defraud' },
                    { value: 'inappropriate', label: 'Inappropriate Content', desc: 'Offensive or explicit content' },
                    { value: 'other', label: 'Other', desc: 'Something else' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setReportCategory(option.value as any)}
                      disabled={submittingReport}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        reportCategory === option.value
                          ? 'bg-red-500/20 border-2 border-red-500'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      } disabled:opacity-50`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium text-sm">{option.label}</p>
                          <p className="text-white/50 text-xs">{option.desc}</p>
                        </div>
                        {reportCategory === option.value && (
                          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/70 text-sm mb-2 font-medium">
                  Additional Details
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Please provide more details about the issue..."
                  disabled={submittingReport}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-red-500/50 transition-all resize-none disabled:opacity-50"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 lg:p-8 border-t border-white/10 flex-shrink-0">
              <button
                onClick={() => {
                  setShowReportModal(false)
                  setReportCategory('harassment')
                  setReportDescription('')
                }}
                disabled={submittingReport}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReportConversation}
                disabled={submittingReport || !reportDescription.trim()}
                className="flex-1 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submittingReport ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Flag className="w-4 h-4" />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claim Item Modal */}
      {showClaimModal && selectedConversation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="backdrop-blur-xl bg-[#2f1632] border border-white/10 rounded-3xl max-w-lg w-full shadow-2xl p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Mark Item as Claimed</h3>
                <p className="text-sm text-white/60">{selectedConversation.itemTitle}</p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 mb-6">
              <p className="text-white/70 text-sm">
                Set a meetup location on campus where you'll hand over the item.
              </p>

              <div>
                <label className="block text-white/70 text-sm mb-2 font-medium">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Meetup Location
                </label>
                <input
                  type="text"
                  value={meetupLocation}
                  onChange={(e) => setMeetupLocation(e.target.value)}
                  placeholder="e.g., Main Gate, Library Entrance, Cafeteria..."
                  disabled={claimingItem}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-all disabled:opacity-50"
                />
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-blue-200/90 text-sm">
                  💡 Choose a public, well-lit location on campus for safety.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowClaimModal(false);
                  setMeetupLocation('');
                }}
                disabled={claimingItem}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClaimItem}
                disabled={claimingItem || !meetupLocation.trim()}
                className="flex-1 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {claimingItem ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Claiming...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirm Claim
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Picker Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="backdrop-blur-xl bg-[#2f1632] border border-white/10 rounded-3xl max-w-4xl w-full shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#ff7400]/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#ff7400]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Share Location</h3>
                  <p className="text-sm text-white/60">Click on the map to set a pin</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowLocationModal(false);
                  if (!locationPin) {
                    setRoomNumber('');
                  }
                }}
                className="w-10 h-10 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Floor Plan Selector */}
            <div className="mb-4">
              <label className="block text-white/70 text-sm mb-2 font-medium">Select Floor</label>
              <div className="flex gap-2 flex-wrap">
                {floorPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => {
                      setSelectedFloorPlan(plan.id);
                      setLocationPin(null);
                    }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedFloorPlan === plan.id
                        ? 'bg-[#ff7400] text-white'
                        : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {plan.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Floor Plan Map */}
            <div className="mb-4">
              <div
                className="relative aspect-video rounded-xl overflow-hidden bg-[#1a0d1c] border-2 border-white/10 cursor-crosshair hover:border-[#ff7400]/50 transition-all"
                onClick={handleFloorPlanClick}
              >
                <img
                  src={getFloorPlan(selectedFloorPlan)?.imageUrl || '/floor-plans/ground_floor.png'}
                  alt="Floor Plan"
                  className="w-full h-full object-contain pointer-events-none"
                />
                
                {/* Location Pin */}
                {locationPin && (
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 animate-bounce"
                    style={{
                      left: `${locationPin.x}%`,
                      top: `${locationPin.y}%`,
                    }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-[#ff7400] animate-ping opacity-75"></div>
                      <div className="relative w-10 h-10 rounded-full bg-[#ff7400] border-4 border-white shadow-2xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-white/50 mt-2 text-center">
                Click anywhere on the map to place your location pin
              </p>
            </div>

            {/* Room Number Input */}
            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-2 font-medium">
                Room/Location Name (Optional)
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g., Room 301, Library Entrance, Cafeteria..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 transition-all"
              />
            </div>

            {/* Footer */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowLocationModal(false);
                  if (!locationPin) {
                    setRoomNumber('');
                  }
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSendLocation}
                disabled={!locationPin}
                className="flex-1 px-6 py-3 rounded-xl bg-[#ff7400] hover:bg-[#ff8500] text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Set Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
