'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { Card } from '@/src/components/ui/card'
import { ArrowLeft, Send, MessageCircle } from 'lucide-react'
import { mockMessages, mockUsers, mockItems } from '@/src/lib/mock-data'

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const message = {
        id: Date.now().toString(),
        senderId: 'current-user',
        senderName: 'You',
        recipientId: selectedConversation,
        itemId: messages[0]?.itemId || '',
        content: newMessage,
        timestamp: Date.now(),
        read: false,
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  // Get unique conversations
  const conversations = Array.from(
    new Map(messages.map((msg) => [msg.senderId, msg])).values()
  )

  const selectedMessages = selectedConversation
    ? messages.filter(
        (msg) =>
          msg.senderId === selectedConversation ||
          msg.recipientId === selectedConversation
      )
    : []

  const selectedUser = selectedConversation
    ? mockUsers.find((u) => u.id === selectedConversation)
    : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Messages</h1>
                <p className="text-sm text-muted-foreground">
                  {conversations.length} active conversations
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-3">
          {/* Conversations List */}
          <div className="rounded-lg border border-border bg-card lg:col-span-1">
            <div className="border-b border-border p-4">
              <h2 className="font-semibold text-foreground">Conversations</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <MessageCircle className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No messages yet</p>
                </div>
              ) : (
                conversations.map((msg) => (
                  <button
                    key={msg.senderId}
                    onClick={() => setSelectedConversation(msg.senderId)}
                    className={`w-full border-b border-border p-4 text-left transition hover:bg-muted ${
                      selectedConversation === msg.senderId ? 'bg-muted' : ''
                    }`}
                  >
                    <p className="font-medium text-foreground">{msg.senderName}</p>
                    <p className="truncate text-sm text-muted-foreground">{msg.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleDateString()}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="rounded-lg border border-border bg-card lg:col-span-2">
            {selectedConversation && selectedUser ? (
              <div className="flex h-96 flex-col sm:h-[500px]">
                {/* Chat Header */}
                <div className="border-b border-border p-4">
                  <h3 className="font-semibold text-foreground">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 p-4">
                  {selectedMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.senderId === 'current-user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 ${
                          msg.senderId === 'current-user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`mt-1 text-xs ${
                            msg.senderId === 'current-user'
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage()
                        }
                      }}
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center sm:h-[500px]">
                <div className="text-center">
                  <MessageCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Select a conversation to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
