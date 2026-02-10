import { useState } from 'react'
import { Search, Send, Image as ImageIcon, Paperclip, MoreVertical, ArrowLeft } from 'lucide-react'
import LyceanSidebar from '@/components/lycean-sidebar'

const mockConversations = [
  {
    id: 1,
    user: {
      name: 'Maria Santos',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      online: true
    },
    item: {
      title: 'iPhone 13 Pro',
      image: 'https://images.unsplash.com/photo-1592286927505-c0d6c9c24e5a?w=100&h=100&fit=crop',
      type: 'found'
    },
    lastMessage: 'Yes, I found it near the cafeteria!',
    timestamp: '2m ago',
    unread: 2
  },
  {
    id: 2,
    user: {
      name: 'John Reyes',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      online: false
    },
    item: {
      title: 'Silver Bracelet',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=100&h=100&fit=crop',
      type: 'lost'
    },
    lastMessage: 'Can you describe it more?',
    timestamp: '1h ago',
    unread: 0
  },
  {
    id: 3,
    user: {
      name: 'Sarah Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      online: true
    },
    item: {
      title: 'Black Wallet',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop',
      type: 'found'
    },
    lastMessage: 'When can we meet?',
    timestamp: '3h ago',
    unread: 0
  }
]

const mockMessages = [
  {
    id: 1,
    sender: 'them',
    text: 'Hi! I saw your post about the iPhone 13 Pro. Is it still available?',
    timestamp: '10:30 AM'
  },
  {
    id: 2,
    sender: 'me',
    text: 'Yes! I found it near the cafeteria yesterday.',
    timestamp: '10:32 AM'
  },
  {
    id: 3,
    sender: 'them',
    text: 'That might be mine! Does it have a blue case?',
    timestamp: '10:33 AM'
  },
  {
    id: 4,
    sender: 'me',
    text: 'Yes, it does! It also has a small crack on the screen.',
    timestamp: '10:35 AM'
  },
  {
    id: 5,
    sender: 'them',
    text: 'Yes, that\'s definitely mine! Can we meet today?',
    timestamp: '10:36 AM'
  },
  {
    id: 6,
    sender: 'me',
    text: 'Sure! I\'ll be at the library around 2 PM. Does that work for you?',
    timestamp: '10:38 AM'
  },
  {
    id: 7,
    sender: 'them',
    text: 'Perfect! See you there. Thank you so much! 🙏',
    timestamp: '10:40 AM'
  }
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileChat, setShowMobileChat] = useState(false)

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log('Sending:', messageText)
      setMessageText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      <LyceanSidebar />
      <main className="min-h-screen pt-0 pb-0 lg:pl-80 bg-[#2f1632]">
        <div className="h-screen flex">
          {/* Conversations List - Left Sidebar */}
          <div className={`${showMobileChat ? 'hidden lg:flex' : 'flex'} w-full lg:w-96 flex-col border-r border-white/10 bg-[#2f1632]`}>
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-white/10">
              <h1 className="text-2xl lg:text-3xl font-medium text-white mb-4">Messages</h1>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 transition-all"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {mockConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation)
                    setShowMobileChat(true)
                  }}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-all border-b border-white/5 ${
                    selectedConversation.id === conversation.id ? 'bg-white/10' : ''
                  }`}
                >
                  {/* Avatar with online status */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={conversation.user.avatar}
                      alt={conversation.user.name}
                      className="w-12 h-12 rounded-full bg-white/10 ring-2 ring-white/10"
                    />
                    {conversation.user.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#2f1632]"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-white font-medium text-sm truncate">{conversation.user.name}</h3>
                      <span className="text-white/40 text-xs flex-shrink-0 ml-2">{conversation.timestamp}</span>
                    </div>
                    
                    {/* Item info */}
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={conversation.item.image}
                        alt={conversation.item.title}
                        className="w-6 h-6 rounded object-cover"
                      />
                      <span className="text-white/50 text-xs truncate">{conversation.item.title}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-white/60 text-sm truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <span className="ml-2 w-5 h-5 bg-[#ff7400] rounded-full text-white text-xs flex items-center justify-center flex-shrink-0">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area - Right Side */}
          <div className={`${showMobileChat ? 'flex' : 'hidden lg:flex'} flex-1 flex-col bg-[#1a0d1c]`}>
            {/* Chat Header */}
            <div className="p-4 lg:p-6 border-b border-white/10 backdrop-blur-xl bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="lg:hidden w-10 h-10 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>

                <div className="relative">
                  <img
                    src={selectedConversation.user.avatar}
                    alt={selectedConversation.user.name}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 ring-2 ring-white/10"
                  />
                  {selectedConversation.user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 lg:w-3.5 lg:h-3.5 bg-green-500 rounded-full border-2 border-[#1a0d1c]"></div>
                  )}
                </div>

                <div>
                  <h2 className="text-white font-medium text-base lg:text-lg">{selectedConversation.user.name}</h2>
                  <p className="text-white/50 text-xs lg:text-sm">
                    {selectedConversation.user.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              <button className="w-10 h-10 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                <MoreVertical className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* Item Context Banner */}
            <div className="p-3 lg:p-4 border-b border-white/10 backdrop-blur-xl bg-white/5">
              <div className="flex items-center gap-3">
                <img
                  src={selectedConversation.item.image}
                  alt={selectedConversation.item.title}
                  className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl object-cover ring-2 ring-white/10"
                />
                <div className="flex-1">
                  <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-1 ${
                    selectedConversation.item.type === 'lost'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-green-500/20 text-green-300 border border-green-500/30'
                  }`}>
                    {selectedConversation.item.type.charAt(0).toUpperCase() + selectedConversation.item.type.slice(1)}
                  </div>
                  <h3 className="text-white font-medium text-sm lg:text-base">{selectedConversation.item.title}</h3>
                </div>
                <button className="px-4 py-2 bg-[#ff7400] text-white rounded-xl text-sm font-medium hover:bg-[#ff7400]/90 transition-all">
                  View Item
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] lg:max-w-[60%] ${message.sender === 'me' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.sender === 'me'
                          ? 'bg-[#ff7400] text-white rounded-br-sm'
                          : 'backdrop-blur-xl bg-white/10 text-white rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm lg:text-base leading-relaxed">{message.text}</p>
                    </div>
                    <p className={`text-white/40 text-xs mt-1 ${message.sender === 'me' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 lg:p-6 border-t border-white/10 backdrop-blur-xl bg-white/5">
              <div className="flex items-end gap-3">
                <button className="w-10 h-10 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all flex-shrink-0">
                  <Paperclip className="w-5 h-5 text-white/60" />
                </button>

                <button className="w-10 h-10 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all flex-shrink-0">
                  <ImageIcon className="w-5 h-5 text-white/60" />
                </button>

                <div className="flex-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#ff7400]/50 transition-all">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none resize-none text-sm lg:text-base"
                  />
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#ff7400] flex items-center justify-center hover:bg-[#ff7400]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#ff7400]/30 flex-shrink-0"
                >
                  <Send className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
