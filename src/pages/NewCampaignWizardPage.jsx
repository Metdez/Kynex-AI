import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useClaudeAPI from '../hooks/useClaudeAPI';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Phone,
  FileText,
  Video,
  PhoneCall,
  Facebook,
  Search,
  Globe,
  Sparkles,
  Loader2,
  DollarSign,
  Calendar,
  Rocket,
} from 'lucide-react';

const steps = ['Goal', 'Channel', 'AI Generation', 'Review & Edit', 'Budget & Launch'];

const goals = [
  { key: 'book_calls', label: 'Book Calls', description: 'Drive inbound calls from qualified leads', icon: Phone },
  { key: 'applications', label: 'Applications', description: 'Generate form submissions and applications', icon: FileText },
  { key: 'webinar', label: 'Webinar Registrations', description: 'Fill seats for your next webinar event', icon: Video },
  { key: 'phone_calls', label: 'Phone Calls', description: 'Generate direct phone call leads', icon: PhoneCall },
];

const channels = [
  { key: 'facebook', label: 'Facebook / Instagram', description: 'Reach homeowners through social media ads', icon: Facebook },
  { key: 'google', label: 'Google Ads', description: 'Capture high-intent search traffic', icon: Search },
  { key: 'both', label: 'Both Channels', description: 'Maximize reach across social and search', icon: Globe },
];

function GeneratedContentDisplay({ content, editable = false, onChange }) {
  if (!content) return null;

  const handleVariationChange = (index, field, value) => {
    if (!onChange) return;
    const updated = { ...content };
    updated.variations = [...updated.variations];
    updated.variations[index] = { ...updated.variations[index], [field]: value };
    onChange(updated);
  };

  const handleLandingPageChange = (field, value) => {
    if (!onChange) return;
    onChange({ ...content, landingPage: { ...content.landingPage, [field]: value } });
  };

  const inputClass = editable
    ? 'border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-none bg-transparent w-full'
    : '';
  const textareaClass = editable
    ? 'border border-dashed border-slate-200 rounded p-2 focus:border-blue-500 focus:outline-none bg-transparent w-full resize-none'
    : '';

  return (
    <div className="space-y-6">
      {/* Strategy Overview */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-900">Strategy Overview</h3>
        </div>
        {editable ? (
          <textarea
            value={content.strategy}
            onChange={(e) => onChange({ ...content, strategy: e.target.value })}
            className={`text-sm text-slate-600 leading-relaxed ${textareaClass}`}
            rows={3}
          />
        ) : (
          <p className="text-sm text-slate-600 leading-relaxed">{content.strategy}</p>
        )}
      </div>

      {/* Target Audiences */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Target Audiences</h3>
        <div className="space-y-2">
          {content.audiences.map((aud, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-slate-700">{aud.name}</span>
              <span className="text-xs text-slate-400">
                {aud.type} &middot; {aud.size.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ad Variations */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Ad Copy Variations</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {content.variations.map((v, i) => (
            <div key={i} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="text-xs text-slate-400 mb-2">Variation {i + 1}</div>
              {editable ? (
                <>
                  <input
                    type="text"
                    value={v.headline}
                    onChange={(e) => handleVariationChange(i, 'headline', e.target.value)}
                    className={`text-sm font-semibold text-slate-900 mb-1 ${inputClass}`}
                  />
                  <textarea
                    value={v.body}
                    onChange={(e) => handleVariationChange(i, 'body', e.target.value)}
                    className={`text-xs text-slate-600 mb-2 ${textareaClass}`}
                    rows={4}
                  />
                  <input
                    type="text"
                    value={v.cta}
                    onChange={(e) => handleVariationChange(i, 'cta', e.target.value)}
                    className={`text-xs font-medium text-blue-600 ${inputClass}`}
                  />
                </>
              ) : (
                <>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">{v.headline}</h4>
                  <p className="text-xs text-slate-600 mb-2">{v.body}</p>
                  <div className="text-xs font-medium text-blue-600">{v.cta}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Landing Page Preview */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-center text-white">
          {editable ? (
            <>
              <input
                type="text"
                value={content.landingPage.headline}
                onChange={(e) => handleLandingPageChange('headline', e.target.value)}
                className="text-xl font-bold mb-1 bg-transparent border-b border-dashed border-blue-300 focus:border-white focus:outline-none text-center w-full"
              />
              <input
                type="text"
                value={content.landingPage.subheadline}
                onChange={(e) => handleLandingPageChange('subheadline', e.target.value)}
                className="text-blue-100 mb-3 bg-transparent border-b border-dashed border-blue-300 focus:border-white focus:outline-none text-center w-full"
              />
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-1">{content.landingPage.headline}</h2>
              <p className="text-blue-100 mb-3">{content.landingPage.subheadline}</p>
            </>
          )}
          <span className="inline-block bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg text-sm cursor-default">
            {content.landingPage.cta}
          </span>
        </div>
        <div className="p-4 bg-slate-50 text-center text-sm text-slate-600 italic">
          {content.landingPage.testimonial}
        </div>
      </div>

      {/* Budget Recommendation */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Budget Recommendation</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-slate-900">
              ${content.budgetRecommendation.daily}/day
            </div>
            <div className="text-xs text-slate-400">Daily Budget</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-900">
              ${content.budgetRecommendation.monthly.toLocaleString()}/mo
            </div>
            <div className="text-xs text-slate-400">Monthly Cost</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-900">
              ${content.budgetRecommendation.estimatedCPL}
            </div>
            <div className="text-xs text-slate-400">Est. CPL</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-900">
              {content.budgetRecommendation.estimatedBookedCalls}
            </div>
            <div className="text-xs text-slate-400">Est. Booked Calls/mo</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewCampaignWizardPage() {
  const navigate = useNavigate();
  const { generate, loading } = useClaudeAPI();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [editableContent, setEditableContent] = useState(null);
  const [dailyBudget, setDailyBudget] = useState(150);
  const [startDate, setStartDate] = useState('2026-03-01');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const canProceed =
    (currentStep === 1 && selectedGoal !== null) ||
    (currentStep === 2 && selectedChannel !== null) ||
    (currentStep === 3 && generatedContent !== null && !loading) ||
    (currentStep === 4 && editableContent !== null) ||
    currentStep === 5;

  const handleNext = async () => {
    if (currentStep === 2) {
      setCurrentStep(3);
      const goalLabel = goals.find((g) => g.key === selectedGoal)?.label || selectedGoal;
      const channelLabel = channels.find((c) => c.key === selectedChannel)?.label || selectedChannel;
      const prompt = `Generate a complete ad campaign package for a "${goalLabel}" campaign on ${channelLabel} for Prestige Kitchen & Bath. Include: 1) Strategy overview (2-3 sentences), 2) Three ad copy variations testing different angles: pain/frustration, aspiration/dream lifestyle, and social proof. For each: headline (under 40 chars), body copy (under 125 words), CTA text. 3) Landing page copy (headline, subheadline, CTA, testimonial). 4) Budget recommendation (daily, monthly, estimated CPL, estimated booked calls per month).`;
      const data = await generate(prompt);
      setGeneratedContent(data);
      return;
    }
    if (currentStep === 3) {
      setEditableContent(JSON.parse(JSON.stringify(generatedContent)));
      setCurrentStep(4);
      return;
    }
    if (currentStep === 5) {
      showToast('Campaign launched successfully!');
      setTimeout(() => navigate('/campaigns'), 1500);
      return;
    }
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep === 4) {
      setCurrentStep(3);
      return;
    }
    if (currentStep === 3) {
      setGeneratedContent(null);
    }
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/campaigns')}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} />
        </button>
        <h1 className="text-2xl font-semibold text-slate-900">New Campaign</h1>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8 bg-white rounded-lg border border-slate-200 p-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                i + 1 < currentStep
                  ? 'bg-green-600 text-white'
                  : i + 1 === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-500'
              }`}
            >
              {i + 1 < currentStep ? <Check size={16} /> : i + 1}
            </div>
            <span
              className={`ml-2 text-sm hidden md:inline ${
                i + 1 === currentStep ? 'font-medium text-slate-900' : 'text-slate-400'
              }`}
            >
              {step}
            </span>
            {i < steps.length - 1 && <div className="w-8 lg:w-12 h-px bg-slate-200 mx-3" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {/* Step 1 — Goal */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">What's your campaign goal?</h2>
            <p className="text-sm text-slate-500 mb-6">Choose the primary objective for this campaign.</p>
            <div className="grid grid-cols-2 gap-4">
              {goals.map((goal) => {
                const Icon = goal.icon;
                return (
                  <div
                    key={goal.key}
                    onClick={() => setSelectedGoal(goal.key)}
                    className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all ${
                      selectedGoal === goal.key
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon
                      size={24}
                      className={selectedGoal === goal.key ? 'text-blue-600' : 'text-slate-400'}
                    />
                    <h3 className="text-sm font-semibold text-slate-900 mt-3 mb-1">{goal.label}</h3>
                    <p className="text-xs text-slate-500">{goal.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2 — Channel */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Select your channel</h2>
            <p className="text-sm text-slate-500 mb-6">Where should we run your ads?</p>
            <div className="grid grid-cols-3 gap-4">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <div
                    key={channel.key}
                    onClick={() => setSelectedChannel(channel.key)}
                    className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all ${
                      selectedChannel === channel.key
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon
                      size={24}
                      className={
                        selectedChannel === channel.key ? 'text-blue-600' : 'text-slate-400'
                      }
                    />
                    <h3 className="text-sm font-semibold text-slate-900 mt-3 mb-1">
                      {channel.label}
                    </h3>
                    <p className="text-xs text-slate-500">{channel.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3 — AI Generation */}
        {currentStep === 3 && (
          <div>
            {loading && !generatedContent ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">
                  Generating Your Campaign
                </h3>
                <p className="text-sm text-slate-500">
                  AI is crafting your strategy, ad copy, and landing page...
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  Your AI-Generated Campaign
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  Review the generated campaign package below. You can edit everything in the next step.
                </p>
                <GeneratedContentDisplay content={generatedContent} />
              </>
            )}
          </div>
        )}

        {/* Step 4 — Review & Edit */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Review & Edit</h2>
            <p className="text-sm text-slate-500 mb-6">
              Click any text field to edit. Customize the campaign to your needs.
            </p>
            <GeneratedContentDisplay
              content={editableContent}
              editable
              onChange={setEditableContent}
            />
          </div>
        )}

        {/* Step 5 — Budget & Launch */}
        {currentStep === 5 && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Budget Control */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Daily Budget</h3>
              <div className="flex items-center gap-4">
                <DollarSign size={20} className="text-slate-400 flex-shrink-0" />
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={10}
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Number(e.target.value))}
                  className="flex-1"
                />
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(Number(e.target.value))}
                    className="w-20 text-sm border border-slate-300 rounded-md px-2 py-1.5 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Monthly estimate: {formatCurrency(dailyBudget * 30)}
              </div>
            </div>

            {/* Start Date */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Start Date</h3>
              <div className="flex items-center gap-4">
                <Calendar size={20} className="text-slate-400 flex-shrink-0" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-sm border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Campaign Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Goal</span>
                  <span className="font-medium text-slate-900 capitalize">
                    {selectedGoal?.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Channel</span>
                  <span className="font-medium text-slate-900 capitalize">{selectedChannel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Daily Budget</span>
                  <span className="font-medium text-slate-900">{formatCurrency(dailyBudget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Start Date</span>
                  <span className="font-medium text-slate-900">{formatDate(startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ad Variations</span>
                  <span className="font-medium text-slate-900">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Est. CPL</span>
                  <span className="font-medium text-slate-900">~$185</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className={`flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors ${
            currentStep === 1 ? 'invisible' : ''
          }`}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex items-center gap-1.5 px-5 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            currentStep === 5
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {currentStep === 5 ? (
            <>
              Launch Campaign
              <Rocket size={16} />
            </>
          ) : (
            <>
              Next
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-50 flex items-center gap-2">
          <Check size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}
