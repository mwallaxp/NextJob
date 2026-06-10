import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Search, Plus } from 'lucide-react';
import { Card } from '../../components/DesignSystem';

const MessagingSystem = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Sarah Chen',
      company: 'TechStart Inc',
      avatar: '🧑‍💼',
      lastMessage: 'Can you start on Monday?',
      timestamp: 'Today at 2:45 PM',
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: 'Mike Johnson',
      company: 'Design Studio Co',
      avatar: '👨‍💼',
      lastMessage: 'Perfect! I\'ll send the files tomorrow',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Sarah Chen',
      senderType: 'other',
      message: 'Hi! Thanks for your profile. We\'d love to work with you on our project.',
      timestamp: '2:30 PM',
    },
    {
      id: 2,
      sender: 'You',
      senderType: 'self',
      message: 'Thank you! I\'m very interested. What\'s the project about?',
      timestamp: '2:35 PM',
    },
    {
      id: 3,
      sender: 'Sarah Chen',
      senderType: 'other',
      message: 'We need a React developer for an e-commerce platform. The project is 3 months long.',
      timestamp: '2:40 PM',
    },
    {
      id: 4,
      sender: 'Sarah Chen',
      senderType: 'other',
      message: 'Can you start on Monday?',
      timestamp: '2:45 PM',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'You',
        senderType: 'self',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-black-50 py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-black-900 mb-8">Messages</h1>

        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 flex flex-col p-0 overflow-hidden">
            <div className="p-4 border-b border-black-100">
              <div className="relative mb-3">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-black-100 focus:outline-none focus:border-orange-500"
                />
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold transition">
                <Plus size={18} />
                New Conversation
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv)}
                  className={`w-full p-4 text-left border-b border-black-100 hover:bg-black-50 transition ${
                    selectedChat.id === conv.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                      <span className="text-2xl">{conv.avatar}</span>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-black-900">{conv.name}</p>
                      <p className="text-xs text-black-600">{conv.company}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-black-600 line-clamp-1">{conv.lastMessage}</p>
                  <p className="text-xs text-black-500 mt-1">{conv.timestamp}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Chat Area */}
          {selectedChat && (
            <Card className="lg:col-span-2 flex flex-col p-0 overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-black-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-white">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedChat.avatar}</span>
                  <div>
                    <h3 className="font-bold text-black-900">{selectedChat.name}</h3>
                    <p className="text-sm text-black-600">{selectedChat.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-black-100 rounded-lg text-black-600 transition">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 hover:bg-black-100 rounded-lg text-black-600 transition">
                    <Video size={20} />
                  </button>
                  <button className="p-2 hover:bg-black-100 rounded-lg text-black-600 transition">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderType === 'self' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.senderType === 'self'
                          ? 'bg-orange-500 text-white rounded-br-none'
                          : 'bg-black-100 text-black-900 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.senderType === 'self' ? 'text-orange-100' : 'text-black-600'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-black-100 bg-black-50">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-3 rounded-lg border border-black-100 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                  >
                    <Send size={18} />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingSystem;
