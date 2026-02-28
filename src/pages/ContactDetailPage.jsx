import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockContacts } from '../data/mockContacts';
import { mockCallLog } from '../data/mockCallLog';
import { mockCampaigns } from '../data/mockCampaigns';
import StatusBadge from '../components/shared/StatusBadge';
import { formatDate, formatTime, formatCurrency, formatRelativeTime, formatDuration } from '../utils/formatters';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Mail,
  Sparkles,
  Lightbulb,
  Globe,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const timelineIcons = {
  ad_click: Globe,
  page_visit: FileText,
  form_fill: FileText,
  call: Phone,
  sms: MessageSquare,
  email: Mail,
  booking: Calendar,
};

const stageToStatus = {
  'New Lead': 'pending',
  'Contacted': 'active',
  'Call Booked': 'booked',
  'Call Completed': 'completed',
  'Proposal': 'active',
  'Closed Won': 'active',
  'Closed Lost': 'not_interested',
  'Nurture': 'paused',
};

const getScoreColor = (score) => {
  if (score >= 70) return 'bg-green-100 text-green-700';
  if (score >= 40) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
};

export default function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contact = mockContacts.find(c => c.id === id);
  const contactCalls = mockCallLog.filter(call => call.contactId === id);

  const [activeTab, setActiveTab] = useState('timeline');
  const [expandedCallId, setExpandedCallId] = useState(null);
  const [notes, setNotes] = useState(contact?.notes || []);
  const [newNote, setNewNote] = useState('');
  const sourceCampaign = contact ? mockCampaigns.find(c => c.name === contact.source) : null;

  if (!contact) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-medium text-slate-700 mb-2">Contact not found</p>
        <button onClick={() => navigate('/crm')} className="text-sm text-blue-600 hover:underline">Back to CRM</button>
      </div>
    );
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note = { id: `n-${Date.now()}`, text: newNote, timestamp: new Date().toISOString() };
    setNotes(prev => [note, ...prev]);
    setNewNote('');
  };

  const tabs = ['Timeline', 'Transcripts', 'Notes', 'Activity'];

  return (
    <div>
      {/* Back */}
      <button onClick={() => navigate('/crm')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft size={16} /> Back to CRM
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-1">{contact.name}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
              <span className="flex items-center gap-1"><Phone size={14} /> {contact.phone}</span>
              <span className="flex items-center gap-1"><Mail size={14} /> {contact.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getScoreColor(contact.leadScore)}`}>Score: {contact.leadScore}</span>
              <StatusBadge status={stageToStatus[contact.pipelineStage] || 'pending'} />
              <span className="text-xs text-slate-400">{contact.pipelineStage}</span>
              <span className="text-xs text-slate-400">·</span>
              {sourceCampaign ? (
                <button onClick={() => navigate(`/campaigns/${sourceCampaign.id}`)} className="text-xs text-blue-600 hover:text-blue-600 hover:underline">
                  {contact.source}
                </button>
              ) : (
                <span className="text-xs text-slate-500">{contact.source}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-md hover:bg-slate-50 text-slate-700" onClick={() => console.log('Call')}>
              <Phone size={14} /> Call
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-md hover:bg-slate-50 text-slate-700" onClick={() => console.log('SMS')}>
              <MessageSquare size={14} /> SMS
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-md hover:bg-slate-50 text-slate-700" onClick={() => console.log('Email')}>
              <Mail size={14} /> Email
            </button>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900">What You Need to Know</h2>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{contact.aiSummary}</p>
      </div>

      {/* Recommended Action */}
      <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-2">
            <Lightbulb size={16} className="text-amber-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-0.5">Recommended Next Action</h3>
              <p className="text-sm text-slate-600">{contact.recommendedAction.text}</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-xs font-medium bg-amber-600 text-white rounded-md hover:bg-amber-700 whitespace-nowrap" onClick={() => console.log('Action clicked')}>
            {contact.recommendedAction.buttonLabel}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.toLowerCase()
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-500 border-transparent hover:text-slate-800'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="relative ml-4">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
          <div className="space-y-4">
            {[...contact.timeline].reverse().map(event => {
              const Icon = timelineIcons[event.type] || Globe;
              return (
                <div key={event.id} className="flex items-start gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center z-10 flex-shrink-0">
                    <Icon size={12} className="text-slate-500" />
                  </div>
                  <div className="flex-1 pb-1">
                    <p className="text-sm text-slate-700">{event.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(event.timestamp)} at {formatTime(event.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transcripts Tab */}
      {activeTab === 'transcripts' && (
        <div className="space-y-4">
          {contactCalls.length === 0 && (
            <p className="text-sm text-slate-500 py-8 text-center border-2 border-dashed border-slate-100 rounded-lg">No call transcripts for this contact.</p>
          )}
          {contactCalls.map(call => {
            const isExpanded = expandedCallId === call.id;
            return (
              <div key={call.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => setExpandedCallId(isExpanded ? null : call.id)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <StatusBadge status={call.outcome} size="sm" />
                    <span className="text-sm font-medium text-slate-700">{formatDate(call.timestamp)} at {formatTime(call.timestamp)}</span>
                    <span className="text-xs text-slate-400 font-medium tracking-wide">• {formatDuration(call.duration)}</span>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                </button>
                {isExpanded && (
                  <div className="p-5">
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 mb-5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles size={14} className="text-indigo-500" />
                        <span className="text-sm font-bold text-slate-900">AI Summary</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{call.aiSummary}</p>
                    </div>

                    {call.keyInfo && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {Object.entries(call.keyInfo).map(([k, v]) => (
                          <div key={k} className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-sm font-medium text-slate-900">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 ml-1">Full Transcript</p>
                      <div className="space-y-4">
                        {call.transcript.split('\n\n').map((para, i) => {
                          const isAgent = para.startsWith('Agent:');
                          return (
                            <div key={i} className={`flex gap-3 ${isAgent ? '' : 'pl-6'}`}>
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isAgent ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                {isAgent ? 'AI' : contact.name[0]}
                              </div>
                              <div className={`p-3 rounded-lg flex-1 ${isAgent ? 'bg-indigo-50 text-slate-900 rounded-tl-none border border-indigo-100' : 'bg-slate-50 text-slate-700 rounded-xl rounded-tl-none border border-slate-200'}`}>
                                {para.replace(/^(Agent|Lead):\s*/, '')}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div>
          <div className="mb-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            <button
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="mt-2 px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Note
            </button>
          </div>
          <div className="space-y-3">
            {notes.map(note => (
              <div key={note.id} className="bg-white rounded-lg border border-slate-200 p-3">
                <p className="text-sm text-slate-700">{note.text}</p>
                <p className="text-xs text-slate-400 mt-1">{formatDate(note.timestamp)} at {formatTime(note.timestamp)}</p>
              </div>
            ))}
            {notes.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No notes yet.</p>}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-2">
          {contact.activity.map(event => {
            const Icon = timelineIcons[event.type] || Globe;
            return (
              <div key={event.id} className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 p-3">
                <Icon size={14} className="text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-700 flex-1">{event.description}</span>
                <span className="text-xs text-slate-400 whitespace-nowrap">{formatRelativeTime(event.timestamp)}</span>
              </div>
            );
          })}
          {contact.activity.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No activity recorded.</p>}
        </div>
      )}
    </div>
  );
}
