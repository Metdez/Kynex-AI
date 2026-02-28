import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  RefreshCw,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Plug,
  Bot,
  GripVertical,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const stepLabels = ['Website', 'Business Profile', 'Integrations', 'Agent Preferences', 'Pipeline', 'Done'];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1
  const [websiteUrl, setWebsiteUrl] = useState('https://www.prestigekb.com');
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // Step 2
  const [profile, setProfile] = useState({
    name: 'Prestige Kitchen & Bath',
    offer: 'Premium kitchen and bathroom remodeling for Austin homeowners. Free in-home 3D design consultation.',
    audience: 'Homeowners in Austin, TX considering kitchen or bathroom remodel. Budget $25K-$55K.',
    tone: 'Professional',
    conversionGoal: 'Booking',
  });

  // Step 3
  const [integrations, setIntegrations] = useState([
    { id: 'meta', name: 'Meta Business Manager', icon: '📘', connected: false },
    { id: 'google', name: 'Google Ads', icon: '🔍', connected: false },
    { id: 'gcal', name: 'Google Calendar', icon: '📅', connected: false },
    { id: 'twilio', name: 'Twilio', icon: '💬', connected: false },
  ]);

  // Step 4
  const [agentModes, setAgentModes] = useState({
    ads: 'review',
    voice: 'supervised',
    sms: 'supervised',
    email: 'supervised',
  });

  // Step 5
  const [stages, setStages] = useState([
    'New Lead', 'Contacted', 'Call Booked', 'Call Completed',
    'Proposal', 'Closed Won', 'Closed Lost', 'Nurture',
  ]);
  const [newStage, setNewStage] = useState('');
  const [dragIdx, setDragIdx] = useState(null);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
    }, 2500);
  };

  const toggleIntegration = (id) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
  };

  const toggleAgentMode = (key) => {
    setAgentModes(prev => ({ ...prev, [key]: prev[key] === 'review' ? 'supervised' : 'review' }));
  };

  const addStage = () => {
    if (newStage.trim()) {
      setStages([...stages, newStage.trim()]);
      setNewStage('');
    }
  };

  const removeStage = (idx) => setStages(stages.filter((_, i) => i !== idx));

  const handleStageDrop = (targetIdx) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const updated = [...stages];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(targetIdx, 0, moved);
    setStages(updated);
    setDragIdx(null);
  };

  const agents = [
    { key: 'ads', name: 'Ad Manager', icon: '📢', desc: 'Creates and optimizes ad campaigns' },
    { key: 'voice', name: 'Voice Agent', icon: '📞', desc: 'Makes outbound calls to leads' },
    { key: 'sms', name: 'SMS Agent', icon: '💬', desc: 'Sends and responds to text messages' },
    { key: 'email', name: 'Email Agent', icon: '📧', desc: 'Manages email sequences and replies' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 py-8">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">G</div>
        <span className="text-lg font-bold text-slate-900">GrowthPilot</span>
      </div>

      {/* Progress */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">Step {step} of 6</span>
          <span className="text-sm font-medium text-slate-700">{stepLabels[step - 1]}</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        {/* Step 1: Website URL */}
        {step === 1 && (
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe size={24} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Let's build your profile</h2>
            <p className="text-sm text-slate-500 mb-6">Paste your website URL and we'll scan it to create your business profile.</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleScan}
                disabled={scanning || !websiteUrl.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {scanning ? <RefreshCw size={16} className="animate-spin" /> : <Globe size={16} />}
                {scanning ? 'Scanning...' : 'Scan My Site'}
              </button>
            </div>
            {scanning && (
              <div className="mt-6">
                <div className="w-64 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden">
                  <div className="h-2 bg-blue-600 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
                <p className="text-xs text-slate-400 mt-2">Analyzing your website...</p>
              </div>
            )}
            {scanComplete && (
              <div className="mt-6 flex items-center justify-center gap-2 text-green-600">
                <CheckCircle size={20} />
                <span className="text-sm font-medium">Profile built from your website!</span>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Review Business Profile */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">Review your business profile</h2>
            <p className="text-sm text-slate-500 mb-6">We built this from your website. Edit anything that needs updating.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Business Name</label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Offer Description</label>
                <textarea
                  value={profile.offer}
                  onChange={(e) => setProfile({ ...profile, offer: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Target Audience</label>
                <textarea
                  value={profile.audience}
                  onChange={(e) => setProfile({ ...profile, audience: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Brand Voice / Tone</label>
                  <select
                    value={profile.tone}
                    onChange={(e) => setProfile({ ...profile, tone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Friendly</option>
                    <option>Authoritative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Conversion Goal</label>
                  <select
                    value={profile.conversionGoal}
                    onChange={(e) => setProfile({ ...profile, conversionGoal: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Booking</option>
                    <option>Phone Call</option>
                    <option>Application</option>
                    <option>Form Fill</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Connect Integrations */}
        {step === 3 && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Plug size={18} className="text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">Connect your tools</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Connect your ad platforms and communication tools. You can always do this later in Settings.</p>
            <div className="grid grid-cols-2 gap-4">
              {integrations.map(int => (
                <div key={int.id} className="bg-white rounded-lg border border-slate-200 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{int.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{int.name}</div>
                      {int.connected && <span className="text-xs text-green-600">Connected ✓</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleIntegration(int.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      int.connected
                        ? 'border border-red-200 text-red-600 hover:bg-red-50'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {int.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Agent Preferences */}
        {step === 4 && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bot size={18} className="text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">Configure your AI agents</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Choose how much autonomy each agent gets. You can change these anytime.</p>
            <div className="space-y-4">
              {agents.map(agent => (
                <div key={agent.key} className="bg-white rounded-lg border border-slate-200 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{agent.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{agent.name}</div>
                      <div className="text-xs text-slate-500">{agent.desc}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      agentModes[agent.key] === 'review'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {agentModes[agent.key] === 'review' ? 'Review Mode' : 'Supervised'}
                    </span>
                    <button
                      onClick={() => toggleAgentMode(agent.key)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        agentModes[agent.key] === 'supervised' ? 'bg-green-500' : 'bg-amber-400'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        agentModes[agent.key] === 'supervised' ? 'translate-x-5' : ''
                      }`} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-xs text-slate-500">
                <strong className="text-slate-700">Review Mode:</strong> All actions are queued for your approval before execution.
                <br />
                <strong className="text-slate-700">Supervised Mode:</strong> Agent acts autonomously within set parameters. You'll get notifications.
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Pipeline Stages */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">Set up your pipeline stages</h2>
            <p className="text-sm text-slate-500 mb-6">Drag to reorder, rename, or add/remove stages. We've pre-filled common defaults.</p>
            <div className="space-y-2">
              {stages.map((stage, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={() => setDragIdx(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleStageDrop(idx)}
                  className={`flex items-center gap-3 bg-white border rounded-lg px-4 py-2.5 cursor-move transition-colors ${
                    dragIdx === idx ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <GripVertical size={14} className="text-slate-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-400 w-5">{idx + 1}</span>
                  <input
                    value={stage}
                    onChange={(e) => {
                      const updated = [...stages];
                      updated[idx] = e.target.value;
                      setStages(updated);
                    }}
                    className="flex-1 text-sm text-slate-900 bg-transparent focus:outline-none focus:ring-0"
                  />
                  <button onClick={() => removeStage(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <input
                value={newStage}
                onChange={(e) => setNewStage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addStage()}
                placeholder="Add a new stage..."
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={addStage} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50">
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Done */}
        {step === 6 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">You're all set!</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
              Your AI co-pilot has already started analyzing your business and building your first campaign.
              It's waiting for you in the Approval Queue.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Approval Queue <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {step < 6 && (
        <div className="w-full max-w-2xl mt-6 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-3">
            {step === 3 && (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800"
              >
                Skip for Now
              </button>
            )}
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
