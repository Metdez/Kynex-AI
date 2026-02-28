import { useState } from 'react';
import { Building2, Bot, Plug, GitBranch, Bell, Shield, User, RefreshCw, Check, GripVertical, Plus, Trash2, Megaphone, Phone, MessageSquare, Mail, Upload, X } from 'lucide-react';

const settingsTabs = [
  { id: 'business', label: 'Business Profile', icon: Building2 },
  { id: 'agents', label: 'Agent Controls', icon: Bot },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'pipeline', label: 'Pipeline Stages', icon: GitBranch },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'compliance', label: 'Compliance', icon: Shield },
  { id: 'account', label: 'Account', icon: User },
];

const defaultIntegrations = [
  { id: 'meta', name: 'Meta Business Manager', description: 'Facebook & Instagram Ads', connected: true, icon: '📘' },
  { id: 'google', name: 'Google Ads', description: 'Search & Display campaigns', connected: true, icon: '🔍' },
  { id: 'gcal', name: 'Google Calendar', description: 'Booking sync', connected: true, icon: '📅' },
  { id: 'twilio', name: 'Twilio', description: 'SMS messaging', connected: true, icon: '💬' },
  { id: 'voice', name: 'Voice Provider', description: 'AI voice calling', connected: false, icon: '📞' },
  { id: 'zapier', name: 'Zapier / Make', description: 'Workflow automation', connected: false, icon: '⚡' },
];

const defaultStages = ['New Lead', 'Contacted', 'Call Booked', 'Call Completed', 'Proposal', 'Closed Won', 'Closed Lost', 'Nurture'];

const notificationEvents = ['New Lead', 'Call Booked', 'Call Completed', 'Budget Alert', 'Agent Exception', 'Daily Digest'];

const teamMembers = [
  { name: 'Jake Morrison', email: 'jake@prestigekb.com', role: 'Owner' },
  { name: 'Sarah Chen', email: 'sarah@prestigekb.com', role: 'Admin' },
  { name: 'Mike Rodriguez', email: 'mike@prestigekb.com', role: 'Sales' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Settings</h1>

      {/* Tab nav */}
      <div className="flex gap-1 mb-6 border-b border-slate-200 overflow-x-auto">
        {settingsTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'business' && <BusinessProfileTab />}
      {activeTab === 'agents' && <AgentControlsTab />}
      {activeTab === 'integrations' && <IntegrationsTab />}
      {activeTab === 'pipeline' && <PipelineTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'compliance' && <ComplianceTab />}
      {activeTab === 'account' && <AccountTab />}
    </div>
  );
}

function BusinessProfileTab() {
  const [profile, setProfile] = useState({
    name: 'Prestige Kitchen & Bath',
    website: 'https://www.prestigekb.com',
    offer: 'Premium kitchen and bathroom remodeling for Austin homeowners. Free in-home 3D design consultation, transparent pricing, and 5-year workmanship warranty.',
    idealClient: 'Homeowners in Austin, TX metro area considering kitchen or bathroom remodel. Typical budget $25K-$55K. Values quality, design, and transparency.',
    tone: 'Professional',
    conversionGoal: 'Booking',
  });
  const [scanning, setScanning] = useState(false);

  return (
    <div className="max-w-2xl space-y-5">
      <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
        <FormField label="Business Name" value={profile.name} onChange={v => setProfile({ ...profile, name: v })} />
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <FormField label="Website URL" value={profile.website} onChange={v => setProfile({ ...profile, website: v })} />
          </div>
          <button
            onClick={() => { setScanning(true); setTimeout(() => setScanning(false), 2000); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-md hover:bg-slate-50 transition-colors mb-px"
          >
            <RefreshCw size={14} className={scanning ? 'animate-spin' : ''} />
            {scanning ? 'Scanning...' : 'Re-scan Website'}
          </button>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Offer Description</label>
          <textarea value={profile.offer} onChange={e => setProfile({ ...profile, offer: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Ideal Client Description</label>
          <textarea value={profile.idealClient} onChange={e => setProfile({ ...profile, idealClient: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Brand Voice / Tone</label>
            <select value={profile.tone} onChange={e => setProfile({ ...profile, tone: e.target.value })} className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Professional</option>
              <option>Casual</option>
              <option>Friendly</option>
              <option>Authoritative</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Conversion Goal</label>
            <select value={profile.conversionGoal} onChange={e => setProfile({ ...profile, conversionGoal: e.target.value })} className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Phone Call</option>
              <option>Booking</option>
              <option>Application</option>
              <option>Form Fill</option>
            </select>
          </div>
        </div>
      </div>
      <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Save Changes</button>
    </div>
  );
}

function AgentControlsTab() {
  const [agents, setAgents] = useState([
    { id: 'ads', name: 'Ads Agent', icon: Megaphone, mode: 'review', spendCeiling: 300, reallocationThreshold: 20 },
    { id: 'voice', name: 'Voice Agent', icon: Phone, mode: 'supervised', activeStart: '09:00', activeEnd: '19:00', maxCalls: 2, blockedCodes: '' },
    { id: 'sms', name: 'SMS Agent', icon: MessageSquare, mode: 'supervised', cadence: 'balanced', dailyCap: 200, sendStart: '09:00', sendEnd: '20:00' },
    { id: 'email', name: 'Email Agent', icon: Mail, mode: 'supervised', dailyLimit: 100, sendStart: '08:00', sendEnd: '18:00' },
  ]);

  const updateAgent = (idx, updates) => {
    const updated = [...agents];
    updated[idx] = { ...updated[idx], ...updates };
    setAgents(updated);
  };

  return (
    <div className="max-w-3xl space-y-4">
      {agents.map((agent, idx) => {
        const Icon = agent.icon;
        return (
          <div key={agent.id} className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon size={18} className="text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-900">{agent.name}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${agent.mode === 'review' ? 'text-amber-600' : 'text-green-600'}`}>
                  {agent.mode === 'review' ? 'Review Mode' : 'Supervised Mode'}
                </span>
                <button
                  onClick={() => updateAgent(idx, { mode: agent.mode === 'review' ? 'supervised' : 'review' })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${agent.mode === 'supervised' ? 'bg-green-500' : 'bg-amber-500'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow ${agent.mode === 'supervised' ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {agent.mode === 'review'
                ? 'All actions are queued for your approval before execution.'
                : 'Agent acts autonomously within set parameters. Exceptions are flagged for review.'
              }
            </p>

            <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
              {agent.id === 'ads' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Daily Spend Ceiling</label>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-slate-500">$</span>
                      <input type="number" value={agent.spendCeiling} onChange={e => updateAgent(idx, { spendCeiling: Number(e.target.value) })} className="w-24 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Budget Reallocation Threshold</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min={5} max={50} value={agent.reallocationThreshold} onChange={e => updateAgent(idx, { reallocationThreshold: Number(e.target.value) })} className="flex-1" />
                      <span className="text-sm font-medium text-slate-700 w-10">{agent.reallocationThreshold}%</span>
                    </div>
                  </div>
                </>
              )}
              {agent.id === 'voice' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Active Hours</label>
                    <div className="flex items-center gap-2">
                      <input type="time" value={agent.activeStart} onChange={e => updateAgent(idx, { activeStart: e.target.value })} className="px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <span className="text-slate-400 text-sm">to</span>
                      <input type="time" value={agent.activeEnd} onChange={e => updateAgent(idx, { activeEnd: e.target.value })} className="px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Max Calls / Lead / Day</label>
                    <input type="number" min={1} max={5} value={agent.maxCalls} onChange={e => updateAgent(idx, { maxCalls: Number(e.target.value) })} className="w-20 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </>
              )}
              {agent.id === 'sms' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Sequence Cadence</label>
                    <select value={agent.cadence} onChange={e => updateAgent(idx, { cadence: e.target.value })} className="px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="aggressive">Aggressive</option>
                      <option value="balanced">Balanced</option>
                      <option value="conservative">Conservative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Daily Volume Cap</label>
                    <input type="number" value={agent.dailyCap} onChange={e => updateAgent(idx, { dailyCap: Number(e.target.value) })} className="w-24 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </>
              )}
              {agent.id === 'email' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Daily Send Limit</label>
                    <input type="number" value={agent.dailyLimit} onChange={e => updateAgent(idx, { dailyLimit: Number(e.target.value) })} className="w-24 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Sending Hours</label>
                    <div className="flex items-center gap-2">
                      <input type="time" value={agent.sendStart} onChange={e => updateAgent(idx, { sendStart: e.target.value })} className="px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <span className="text-slate-400 text-sm">to</span>
                      <input type="time" value={agent.sendEnd} onChange={e => updateAgent(idx, { sendEnd: e.target.value })} className="px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IntegrationsTab() {
  const [integrations, setIntegrations] = useState(defaultIntegrations);

  const toggle = (id) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
  };

  return (
    <div className="max-w-3xl grid grid-cols-2 gap-4">
      {integrations.map(integration => (
        <div key={integration.id} className="bg-white rounded-lg border border-slate-200 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{integration.icon}</span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{integration.name}</h3>
              <p className="text-xs text-slate-500">{integration.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {integration.connected && (
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <Check size={12} /> Connected
              </span>
            )}
            <button
              onClick={() => toggle(integration.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                integration.connected
                  ? 'border border-red-200 text-red-600 hover:bg-red-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {integration.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PipelineTab() {
  const [stages, setStages] = useState(defaultStages.map((name, i) => ({ id: `stage-${i}`, name })));
  const [dragIdx, setDragIdx] = useState(null);

  const addStage = () => {
    setStages([...stages, { id: `stage-${Date.now()}`, name: 'New Stage' }]);
  };

  const removeStage = (id) => {
    setStages(stages.filter(s => s.id !== id));
  };

  const updateName = (id, name) => {
    setStages(stages.map(s => s.id === id ? { ...s, name } : s));
  };

  const handleDragStart = (idx) => setDragIdx(idx);

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const updated = [...stages];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(idx, 0, moved);
    setStages(updated);
    setDragIdx(idx);
  };

  return (
    <div className="max-w-lg space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-1">
        {stages.map((stage, i) => (
          <div
            key={stage.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={e => handleDragOver(e, i)}
            onDragEnd={() => setDragIdx(null)}
            className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-slate-50 group"
          >
            <GripVertical size={14} className="text-slate-300 cursor-grab" />
            <span className="text-xs text-slate-400 w-5">{i + 1}.</span>
            <input
              value={stage.name}
              onChange={e => updateName(stage.id, e.target.value)}
              className="flex-1 text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none px-1 py-0.5"
            />
            <button onClick={() => removeStage(stage.id)} className="p-1 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={addStage} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
          <Plus size={14} /> Add Stage
        </button>
        <button className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Save Changes</button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const channels = ['Push', 'Email', 'In-App'];
  const [settings, setSettings] = useState(() => {
    const initial = {};
    notificationEvents.forEach(event => {
      initial[event] = { Push: true, Email: true, 'In-App': true };
    });
    initial['Daily Digest'] = { Push: false, Email: true, 'In-App': false };
    return initial;
  });
  const [digestTime, setDigestTime] = useState('08:00');

  const toggle = (event, channel) => {
    setSettings(prev => ({
      ...prev,
      [event]: { ...prev[event], [channel]: !prev[event][channel] },
    }));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Event</th>
              {channels.map(ch => (
                <th key={ch} className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{ch}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {notificationEvents.map(event => (
              <tr key={event} className="border-b border-slate-100">
                <td className="px-4 py-3 text-sm text-slate-700">{event}</td>
                {channels.map(ch => (
                  <td key={ch} className="text-center px-4 py-3">
                    <button
                      onClick={() => toggle(event, ch)}
                      className={`relative w-9 h-5 rounded-full transition-colors ${settings[event]?.[ch] ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow ${settings[event]?.[ch] ? 'translate-x-4' : ''}`} />
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Daily Digest Time</h3>
        <input type="time" value={digestTime} onChange={e => setDigestTime(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>
  );
}

function ComplianceTab() {
  const [tcpaStart, setTcpaStart] = useState('08:00');
  const [tcpaEnd, setTcpaEnd] = useState('21:00');
  const [maxCalls, setMaxCalls] = useState(3);
  const [guardrails, setGuardrails] = useState({ medical: false, financial: false, realEstate: true });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Suppression List</h3>
        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
          <Upload size={24} className="text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Drag & drop a CSV file or click to upload</p>
          <p className="text-xs text-slate-400 mt-1">Currently: 47 numbers suppressed</p>
          <button className="mt-3 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            Upload File
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Consent Documentation</h3>
        <div className="bg-slate-50 rounded-md p-4 text-xs text-slate-600 leading-relaxed max-h-32 overflow-y-auto">
          By submitting this form, you consent to receive calls and text messages from Prestige Kitchen & Bath regarding your remodeling inquiry. Message frequency varies. Message and data rates may apply. Reply STOP to opt out at any time. Reply HELP for help. View our Privacy Policy and Terms of Service for more information.
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">TCPA Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Calling Hours</label>
            <div className="flex items-center gap-2">
              <input type="time" value={tcpaStart} onChange={e => setTcpaStart(e.target.value)} className="px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="text-slate-400 text-sm">to</span>
              <input type="time" value={tcpaEnd} onChange={e => setTcpaEnd(e.target.value)} className="px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Max Calls / Number / Day</label>
            <input type="number" min={1} max={10} value={maxCalls} onChange={e => setMaxCalls(Number(e.target.value))} className="w-20 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Industry Guardrails</h3>
        <div className="space-y-3">
          {[
            { key: 'medical', label: 'Medical', desc: 'Enables HIPAA-compliant messaging and restricts medical claims in ad copy.' },
            { key: 'financial', label: 'Financial', desc: 'Adds required financial disclaimers and restricts income/return claims.' },
            { key: 'realEstate', label: 'Real Estate / Home Services', desc: 'Ensures Fair Housing Act compliance and appropriate home improvement licensing disclosures.' },
          ].map(item => (
            <div key={item.key} className="flex items-start gap-3">
              <button
                onClick={() => setGuardrails(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border shrink-0 ${guardrails[item.key] ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}
              >
                {guardrails[item.key] && <Check size={12} className="text-white" />}
              </button>
              <div>
                <span className="text-sm font-medium text-slate-900">{item.label}</span>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccountTab() {
  const [user, setUser] = useState({ name: 'Jake Morrison', email: 'jake@prestigekb.com', phone: '(512) 555-0100' });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Your Profile</h3>
        <FormField label="Full Name" value={user.name} onChange={v => setUser({ ...user, name: v })} />
        <FormField label="Email" value={user.email} onChange={v => setUser({ ...user, email: v })} />
        <FormField label="Phone" value={user.phone} onChange={v => setUser({ ...user, phone: v })} />
        <button className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Save Profile</button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Billing</h3>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg p-5">
          <div className="text-xs text-white/60 uppercase tracking-wide">Current Plan</div>
          <div className="text-xl font-bold mt-1">Growth Plan</div>
          <div className="text-white/80 text-sm mt-0.5">$497/mo</div>
          <button className="mt-4 px-3 py-1.5 text-xs font-medium bg-white text-slate-900 rounded-md hover:bg-slate-50/90 transition-colors">Change Plan</button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Team Members</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            <Plus size={14} /> Invite Member
          </button>
        </div>
        <div className="space-y-2">
          {teamMembers.map(member => (
            <div key={member.email} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">{member.name}</div>
                  <div className="text-xs text-slate-500">{member.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  member.role === 'Owner' ? 'bg-purple-100 text-purple-700' : member.role === 'Admin' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {member.role}
                </span>
                {member.role !== 'Owner' && (
                  <button className="p-1 rounded hover:bg-red-50"><X size={14} className="text-red-400" /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
