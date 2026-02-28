import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, PhoneCall, PhoneOff, PhoneMissed, Clock, Mic, ChevronDown, ChevronUp, Search, Sparkles, Play, Edit3, Plus, Settings, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { mockCallLog } from '../data/mockCallLog';
import StatusBadge from '../components/shared/StatusBadge';
import MetricCard from '../components/shared/MetricCard';
import { formatDuration, formatRelativeTime, formatTime, formatDate } from '../utils/formatters';
import { useApp } from '../context/AppContext';
import EmptyState from '../components/shared/EmptyState';

const tabs = ['Overview', 'Call Log', 'Scripts', 'Settings'];
const filterTabs = ['All', 'Booked', 'Interested', 'No Answer', 'Not Interested'];

const outcomeIcons = {
  booked: PhoneCall,
  interested: Phone,
  no_answer: PhoneMissed,
  not_interested: PhoneOff,
};

const donutData = [
  { name: 'Booked', value: 31, color: '#22c55e' },
  { name: 'Interested', value: 24, color: '#f59e0b' },
  { name: 'No Answer', value: 33, color: '#94a3b8' },
  { name: 'Not Interested', value: 12, color: '#ef4444' },
];

const activeScript = {
  introduction: "Hi, this is Alex from Prestige Kitchen & Bath. Am I speaking with {name}? Great! I'm calling because you recently expressed interest in a kitchen/bathroom remodel. I'd love to learn more about what you're envisioning. Is now a good time for a quick chat?",
  qualifyingQuestions: [
    "What's the main thing you'd like to change about your current kitchen/bathroom?",
    "Have you started looking at any specific designs or materials?",
    "What's your ideal timeline for getting this project started?",
    "Do you have a budget range in mind for this project?",
    "Is there anyone else involved in the decision who should be part of the consultation?",
  ],
  objectionHandling: [
    { trigger: "Too expensive / budget concerns", response: "I completely understand — this is a significant investment. That's exactly why we offer a free in-home consultation with no obligation. Our designer will show you options at different price points, and we also have financing available." },
    { trigger: "Just browsing / not ready", response: "No problem at all! Many of our best projects started with someone just exploring their options. Can I send you our portfolio and some pricing guides so you have them when you're ready?" },
    { trigger: "Already talking to other contractors", response: "That's smart — getting multiple perspectives is always a good idea. What I'd suggest is letting our designer show you a free 3D preview of your space. It's a great way to compare what different companies can offer." },
    { trigger: "Need to talk to spouse", response: "Absolutely, that's a big decision you want to make together. Our consultation is actually designed for both of you — the designer can address both your preferences. Would your spouse be available to join?" },
  ],
  bookingTransition: "Based on what you've told me, I think you'd really benefit from a free design consultation. Our designer will come to your home, take measurements, and create a 3D preview of your new space. We have openings next week — would [Day] or [Day] work better for you?",
};

export default function VoiceAgentPage() {
  const navigate = useNavigate();
  const { approvalCount, setApprovalCount } = useApp();
  const [activeTab, setActiveTab] = useState('Overview');
  const [callFilter, setCallFilter] = useState('All');
  const [expandedCall, setExpandedCall] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingScript, setIsEditingScript] = useState(false);
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({
    activeHoursStart: '09:00',
    activeHoursEnd: '19:00',
    maxCallsPerDay: 2,
    voicemailMessage: "Hi, this is Alex from Prestige Kitchen & Bath. I'm calling about your interest in a kitchen or bathroom remodel. We'd love to help bring your vision to life with a free in-home design consultation. Please give us a call back at 512-555-0100, or reply to the text I'll send shortly. Have a great day!",
    humanHandoff: true,
    blockedNumbers: '',
  });

  const filteredCalls = mockCallLog
    .filter(call => {
      if (callFilter === 'All') return true;
      const filterMap = { 'Booked': 'booked', 'Interested': 'interested', 'No Answer': 'no_answer', 'Not Interested': 'not_interested' };
      return call.outcome === filterMap[callFilter];
    })
    .filter(call => !searchQuery || call.contactName.toLowerCase().includes(searchQuery.toLowerCase()));

  const todayCalls = mockCallLog.filter(c => c.timestamp.startsWith('2026-02-28')).length;
  const weekCalls = mockCallLog.length;
  const answeredCalls = mockCallLog.filter(c => c.duration > 0).length;
  const bookedCalls = mockCallLog.filter(c => c.outcome === 'booked').length;
  const answerRate = Math.round((answeredCalls / weekCalls) * 100);
  const bookingRate = Math.round((bookedCalls / answeredCalls) * 100);
  const avgDuration = Math.round(mockCallLog.filter(c => c.duration > 0).reduce((sum, c) => sum + c.duration, 0) / answeredCalls);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Voice Agent</h1>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Active Now — 9AM to 7PM CST
        </span>
      </div>

      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-4">
            <MetricCard label="Calls Today" value={todayCalls} format="number" icon={Phone} trend="up" trendValue="+3" />
            <MetricCard label="Calls This Week" value={weekCalls} format="number" icon={PhoneCall} trend="up" trendValue="+12" />
            <MetricCard label="Answer Rate" value={answerRate} format="percent" icon={BarChart3} trend="up" trendValue="+5%" />
            <MetricCard label="Booking Rate" value={bookingRate} format="percent" icon={Sparkles} trend="up" trendValue="+8%" />
            <MetricCard label="Avg Duration" value={`${Math.floor(avgDuration / 60)}m ${avgDuration % 60}s`} icon={Clock} trend="flat" trendValue="~" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Call Outcomes Breakdown</h3>
              <div className="flex items-center">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                      {donutData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => `${val}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-3">
                  {donutData.map(item => (
                    <div key={item.name} className="flex items-center gap-2 text-sm">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600">{item.name}</span>
                      <span className="font-semibold text-slate-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Calls Today</h3>
              <div className="space-y-3">
                {mockCallLog.filter(c => c.timestamp.startsWith('2026-02-28')).map(call => {
                  const Icon = outcomeIcons[call.outcome];
                  return (
                    <div key={call.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <Icon size={16} className="text-slate-400" />
                        <div>
                          <button onClick={() => navigate(`/crm/${call.contactId}`)} className="text-sm font-medium text-blue-600 hover:text-blue-600 hover:underline text-left">{call.contactName}</button>
                          <div className="text-xs text-slate-500">{formatTime(call.timestamp)} · {call.duration > 0 ? formatDuration(call.duration) : 'No answer'}</div>
                        </div>
                      </div>
                      <StatusBadge status={call.outcome} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Call Log' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {filterTabs.map(f => {
                const count = f === 'All' ? mockCallLog.length : mockCallLog.filter(c => {
                  const map = { 'Booked': 'booked', 'Interested': 'interested', 'No Answer': 'no_answer', 'Not Interested': 'not_interested' };
                  return c.outcome === map[f];
                }).length;
                return (
                  <button
                    key={f}
                    onClick={() => setCallFilter(f)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      callFilter === f ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {f} ({count})
                  </button>
                );
              })}
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search calls..."
                className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Contact</th>
                  <th className="text-left px-4 py-3 font-medium">Date / Time</th>
                  <th className="text-left px-4 py-3 font-medium">Duration</th>
                  <th className="text-left px-4 py-3 font-medium">Outcome</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredCalls.map(call => (
                  <CallRow
                    key={call.id}
                    call={call}
                    isExpanded={expandedCall === call.id}
                    onToggle={() => setExpandedCall(expandedCall === call.id ? null : call.id)}
                  />
                ))}
              </tbody>
            </table>
            {filteredCalls.length === 0 && (
              <EmptyState
                icon={Phone}
                title="No calls match your filters"
                description="Try a different filter or search term."
                actionLabel="Clear Filters"
                onAction={() => { setCallFilter('All'); setSearchQuery(''); }}
              />
            )}
          </div>
        </div>
      )}

      {activeTab === 'Scripts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Active Call Script</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditingScript(!isEditingScript)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
              >
                <Edit3 size={14} />
                {isEditingScript ? 'Done Editing' : 'Edit Script'}
              </button>
              <button
                onClick={() => { setApprovalCount(approvalCount + 1); setToast('New script sent to Approval Queue'); setTimeout(() => setToast(null), 3000); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={14} />
                Create New Script
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            <ScriptBlock title="Introduction" icon={Play} color="blue">
              {isEditingScript ? (
                <textarea className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded p-3 min-h-[80px]" defaultValue={activeScript.introduction} />
              ) : (
                <p className="text-sm text-slate-700 leading-relaxed">{activeScript.introduction}</p>
              )}
            </ScriptBlock>

            <ScriptBlock title="Qualifying Questions" icon={Mic} color="green">
              <ol className="space-y-2">
                {activeScript.qualifyingQuestions.map((q, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="text-slate-400 font-medium">{i + 1}.</span>
                    {isEditingScript ? (
                      <input className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm" defaultValue={q} />
                    ) : (
                      <span>{q}</span>
                    )}
                  </li>
                ))}
              </ol>
            </ScriptBlock>

            <ScriptBlock title="Objection Handling" icon={Settings} color="amber">
              <div className="space-y-3">
                {activeScript.objectionHandling.map((item, i) => (
                  <div key={i} className="border border-slate-100 rounded-lg p-3">
                    <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">If: &ldquo;{item.trigger}&rdquo;</div>
                    {isEditingScript ? (
                      <textarea className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded p-2 min-h-[60px]" defaultValue={item.response} />
                    ) : (
                      <p className="text-sm text-slate-700">{item.response}</p>
                    )}
                  </div>
                ))}
              </div>
            </ScriptBlock>

            <ScriptBlock title="Booking Transition" icon={PhoneCall} color="green">
              {isEditingScript ? (
                <textarea className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded p-3 min-h-[60px]" defaultValue={activeScript.bookingTransition} />
              ) : (
                <p className="text-sm text-slate-700 leading-relaxed">{activeScript.bookingTransition}</p>
              )}
            </ScriptBlock>
          </div>
        </div>
      )}

      {activeTab === 'Settings' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-slate-900">Active Hours</h3>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Start Time</label>
                <input type="time" value={settings.activeHoursStart} onChange={e => setSettings({ ...settings, activeHoursStart: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <span className="text-slate-400 mt-5">to</span>
              <div>
                <label className="block text-xs text-slate-500 mb-1">End Time</label>
                <input type="time" value={settings.activeHoursEnd} onChange={e => setSettings({ ...settings, activeHoursEnd: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Max Calls Per Lead / Day</h3>
            <input type="number" min={1} max={5} value={settings.maxCallsPerDay} onChange={e => setSettings({ ...settings, maxCallsPerDay: Number(e.target.value) })} className="w-24 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Voicemail Message</h3>
            <textarea value={settings.voicemailMessage} onChange={e => setSettings({ ...settings, voicemailMessage: e.target.value })} rows={4} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Human Handoff</h3>
                <p className="text-xs text-slate-500 mt-0.5">Automatically transfer calls to a human when the lead requests it or the conversation becomes complex</p>
              </div>
              <button onClick={() => setSettings({ ...settings, humanHandoff: !settings.humanHandoff })} className={`relative w-11 h-6 rounded-full transition-colors ${settings.humanHandoff ? 'bg-blue-600' : 'bg-slate-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow ${settings.humanHandoff ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Blocked Numbers</h3>
            <textarea value={settings.blockedNumbers} onChange={e => setSettings({ ...settings, blockedNumbers: e.target.value })} placeholder="Enter phone numbers to block, one per line..." rows={3} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Save Settings</button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

function CallRow({ call, isExpanded, onToggle }) {
  const navigate = useNavigate();
  const Icon = outcomeIcons[call.outcome];
  return (
    <>
      <tr onClick={onToggle} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Icon size={14} className="text-slate-400" />
            <span
              className="text-sm font-medium text-blue-600 hover:text-blue-600 hover:underline cursor-pointer"
              onClick={(e) => { e.stopPropagation(); navigate(`/crm/${call.contactId}`); }}
            >
              {call.contactName}
            </span>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-slate-600">{formatDate(call.timestamp)} · {formatTime(call.timestamp)}</td>
        <td className="px-4 py-3 text-sm text-slate-600">{call.duration > 0 ? formatDuration(call.duration) : '—'}</td>
        <td className="px-4 py-3"><StatusBadge status={call.outcome} /></td>
        <td className="px-4 py-3 text-right">{isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}</td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={5} className="bg-slate-50 px-6 py-4">
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={14} className="text-blue-600" />
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">AI Summary</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{call.aiSummary}</p>
              </div>
              {call.keyInfo && (
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(call.keyInfo).map(([key, value]) => (
                    <div key={key} className="bg-white border border-slate-200 rounded-lg p-3">
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</div>
                      <div className="text-sm font-medium text-slate-900">{value}</div>
                    </div>
                  ))}
                </div>
              )}
              {call.transcript && call.duration > 0 && (
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Full Transcript</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {call.transcript.split('\n\n').map((line, i) => {
                      const isAgent = line.startsWith('Agent:');
                      const isLead = line.startsWith('Lead:');
                      return (
                        <div key={i} className={`text-sm leading-relaxed ${isAgent ? 'text-blue-800' : isLead ? 'text-slate-700' : 'text-slate-500 italic'}`}>
                          {isAgent && <><span className="font-semibold">Agent:</span>{line.replace('Agent:', '')}</>}
                          {isLead && <><span className="font-semibold">Lead:</span>{line.replace('Lead:', '')}</>}
                          {!isAgent && !isLead && line}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function ScriptBlock({ title, icon: Icon, color, children }) {
  const colors = {
    blue: { border: 'border-l-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    green: { border: 'border-l-green-500', bg: 'bg-green-50', text: 'text-green-700' },
    amber: { border: 'border-l-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
  };
  const c = colors[color];
  return (
    <div className={`bg-white rounded-lg border border-slate-200 border-l-4 ${c.border} p-5`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`p-1 rounded ${c.bg}`}><Icon size={14} className={c.text} /></span>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}
