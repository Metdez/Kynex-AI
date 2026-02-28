import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMessages } from '../data/mockMessages';
import { mockContacts } from '../data/mockContacts';
import { formatTime, formatRelativeTime, formatCurrency } from '../utils/formatters';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Mail,
  Phone,
  Send,
  Sparkles,
  Calendar,
  FileText,
  User,
  ArrowRightLeft,
  Inbox,
} from 'lucide-react';
import EmptyState from '../components/shared/EmptyState';

const channelIcons = { sms: MessageSquare, email: Mail, call: Phone };

const filterTabs = [
  { key: 'all', label: 'All' },
  { key: 'sms', label: 'SMS' },
  { key: 'email', label: 'Email' },
  { key: 'call', label: 'Calls' },
  { key: 'unread', label: 'Unread' },
];

const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2);

const getScoreColor = (score) => {
  if (score >= 70) return 'bg-green-100 text-green-700';
  if (score >= 40) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
};

export default function InboxPage() {
  const navigate = useNavigate();
  const { setInboxUnreadCount } = useApp();
  const [conversations, setConversations] = useState(mockMessages);
  const [selectedConvId, setSelectedConvId] = useState(mockMessages[0]?.id || null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [draftReply, setDraftReply] = useState('');

  const selectedConv = conversations.find(c => c.id === selectedConvId);
  const contact = selectedConv ? mockContacts.find(c => c.id === selectedConv.contactId) : null;

  useEffect(() => {
    if (selectedConv) {
      setDraftReply(selectedConv.aiDraftReply || '');
    }
  }, [selectedConvId]);

  const filteredConversations = conversations
    .filter(conv => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'unread') return conv.unread;
      return conv.channel === activeFilter;
    })
    .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

  const handleSelectConversation = (id) => {
    setSelectedConvId(id);
    // Mark as read
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: false } : c));
    const newUnreadCount = conversations.filter(c => c.unread && c.id !== id).length;
    setInboxUnreadCount(newUnreadCount);
  };

  const handleSend = () => {
    if (!draftReply.trim()) return;
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConvId) {
        return {
          ...conv,
          unread: false,
          lastMessageAt: new Date().toISOString(),
          messages: [...conv.messages, {
            id: `m-${Date.now()}`,
            sender: 'business',
            text: draftReply,
            timestamp: new Date().toISOString(),
          }],
        };
      }
      return conv;
    }));
    setDraftReply('');
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">Inbox</h1>
      <div className="flex bg-white rounded-lg border border-slate-200 overflow-hidden" style={{ height: 'calc(100vh - 10rem)' }}>
        {/* Left Pane - Conversation List */}
        <div className="w-80 border-r border-slate-200 flex flex-col">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-200">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeFilter === tab.key
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <EmptyState
                  icon={Inbox}
                  title={activeFilter === 'unread' ? 'All caught up!' : 'No conversations'}
                  description={activeFilter === 'unread' ? 'You have no unread messages.' : 'No conversations match this filter.'}
                  actionLabel="Show All"
                  onAction={() => setActiveFilter('all')}
                />
              </div>
            ) : (
              filteredConversations.map(conv => {
                const ChannelIcon = channelIcons[conv.channel] || MessageSquare;
                const lastMsg = conv.messages[conv.messages.length - 1];
                const isActive = conv.id === selectedConvId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`flex items-start gap-3 p-3 cursor-pointer border-b border-slate-100 transition-colors ${
                      isActive ? 'bg-blue-50 border-l-2 border-l-blue-500' : 'hover:bg-slate-50 border-l-2 border-l-transparent'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 flex-shrink-0">
                      {getInitials(conv.contactName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-slate-900 truncate">{conv.contactName}</span>
                          <ChannelIcon size={12} className="text-slate-400" />
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{formatRelativeTime(conv.lastMessageAt)}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{lastMsg?.text?.slice(0, 60)}</p>
                    </div>
                    {conv.unread && <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center Pane - Thread */}
        {selectedConv ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Thread Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">{selectedConv.contactName}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 capitalize">{selectedConv.channel}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-2.5 py-1 text-xs font-medium border border-slate-300 rounded-md hover:bg-slate-50 text-slate-600 flex items-center gap-1" onClick={() => console.log('Book call')}>
                  <Calendar size={12} /> Book Call
                </button>
                <button className="px-2.5 py-1 text-xs font-medium border border-slate-300 rounded-md hover:bg-slate-50 text-slate-600 flex items-center gap-1" onClick={() => console.log('Add note')}>
                  <FileText size={12} /> Add Note
                </button>
                <button className="px-2.5 py-1 text-xs font-medium border border-slate-300 rounded-md hover:bg-slate-50 text-slate-600 flex items-center gap-1" onClick={() => console.log('Change stage')}>
                  <ArrowRightLeft size={12} /> Change Stage
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedConv.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'lead' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${msg.sender === 'lead' ? 'bg-slate-100' : 'bg-blue-50'}`}>
                    <p className="text-sm text-slate-700 whitespace-pre-line">{msg.text}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{formatTime(msg.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Draft Reply */}
            <div className="border-t border-slate-200 p-4">
              <div className="flex items-center gap-1 mb-2">
                <Sparkles size={12} className="text-blue-600" />
                <span className="text-xs font-medium text-blue-600">AI Suggested Reply</span>
              </div>
              <textarea
                value={draftReply}
                onChange={(e) => setDraftReply(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-2"
                rows={3}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSend}
                  disabled={!draftReply.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send size={14} /> Send
                </button>
                <button className="px-4 py-1.5 text-sm font-medium border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                  Edit & Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <p>Select a conversation</p>
          </div>
        )}

        {/* Right Sidebar - Contact Card */}
        {contact && (
          <div className="w-64 border-l border-slate-200 p-4 bg-slate-50 overflow-y-auto">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600 mx-auto mb-2">
                {getInitials(contact.name)}
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{contact.name}</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-500">Lead Score</span>
                <div><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getScoreColor(contact.leadScore)}`}>{contact.leadScore}</span></div>
              </div>
              <div>
                <span className="text-xs text-slate-500">Stage</span>
                <p className="text-slate-700">{contact.pipelineStage}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Source</span>
                <p className="text-slate-700">{contact.source}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Est. Value</span>
                <p className="text-slate-700 font-medium">{formatCurrency(contact.estimatedValue)}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Last Contact</span>
                <p className="text-slate-700">{formatRelativeTime(contact.lastContact)}</p>
              </div>
              <button
                onClick={() => navigate(`/crm/${contact.id}`)}
                className="w-full mt-2 px-3 py-1.5 text-xs font-medium border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center gap-1"
              >
                <User size={12} /> View Full Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
