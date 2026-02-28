import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Mail, Phone, Clock, ChevronDown, ChevronUp, Pause, Edit3, Copy, Sparkles, Send, Eye, MousePointerClick, Reply, CalendarCheck } from 'lucide-react';
import { mockSequences } from '../data/mockSequences';
import StatusBadge from '../components/shared/StatusBadge';

export default function SequenceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState(null);

  const sequence = mockSequences.find(s => s.id === id);
  if (!sequence) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Sequence not found.</p>
        <button onClick={() => navigate('/sms-email')} className="text-blue-600 text-sm mt-2 hover:underline">Back to Sequences</button>
      </div>
    );
  }

  const channelIcon = { sms: MessageSquare, email: Mail, call: Phone };
  const channelColor = { sms: { bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-200' }, email: { bg: 'bg-blue-100', text: 'text-blue-600', ring: 'ring-blue-200' }, call: { bg: 'bg-purple-100', text: 'text-purple-700', ring: 'ring-purple-200' } };
  const typeLabels = { sms: 'SMS', email: 'Email', both: 'SMS + Email' };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/sms-email')} className="p-1.5 rounded-md hover:bg-slate-100 transition-colors">
          <ArrowLeft size={18} className="text-slate-500" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">{sequence.name}</h1>
            <StatusBadge status={sequence.status} size="md" />
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{typeLabels[sequence.type]}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
            <span>{sequence.steps.length} steps</span>
            <span>Open rate: <span className="font-medium text-slate-700">{sequence.openRate}%</span></span>
            <span>Booking rate: <span className="font-medium text-slate-700">{sequence.bookingRate}%</span></span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            <Pause size={14} /> Pause
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            <Edit3 size={14} /> Edit
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            <Copy size={14} /> Duplicate
          </button>
        </div>
      </div>

      {/* Visual Timeline */}
      <div className="max-w-3xl mx-auto">
        {sequence.steps.map((step, i) => {
          const Icon = channelIcon[step.channel] || MessageSquare;
          const colors = channelColor[step.channel] || channelColor.sms;
          const isExpanded = expandedStep === i;
          const isLast = i === sequence.steps.length - 1;

          return (
            <div key={i} className="relative">
              {/* Delay label between steps */}
              {i > 0 && (
                <div className="flex items-center gap-3 py-3 pl-5">
                  <div className="w-px h-6 bg-slate-300 ml-4" />
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-full text-xs text-slate-500 font-medium -ml-3">
                    <Clock size={12} />
                    {step.delay}
                  </div>
                </div>
              )}

              {/* Step card */}
              <div
                onClick={() => setExpandedStep(isExpanded ? null : i)}
                className={`flex gap-4 cursor-pointer group ${!isLast ? '' : ''}`}
              >
                {/* Timeline node */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ${colors.bg} ${colors.ring}`}>
                    <Icon size={16} className={colors.text} />
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                </div>

                {/* Step content */}
                <div className="flex-1 pb-6">
                  <div className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase">Step {step.stepNumber}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text}`}>
                          {step.channel.toUpperCase()}
                        </span>
                        {step.subject && <span className="text-xs text-slate-500">&mdash; {step.subject}</span>}
                      </div>
                      {isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                    </div>

                    {/* Message preview (always visible) */}
                    <p className="text-sm text-slate-600 line-clamp-2">{step.message}</p>

                    {/* Mini metrics row */}
                    {step.sent > 0 && (
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                        <MiniMetric icon={Send} label="Sent" value={step.sent} />
                        <MiniMetric icon={Eye} label="Opened" value={step.opened} />
                        <MiniMetric icon={MousePointerClick} label="Clicked" value={step.clicked} />
                        <MiniMetric icon={Reply} label="Replied" value={step.replied} />
                        <MiniMetric icon={CalendarCheck} label="Booked" value={step.booked} highlight />
                      </div>
                    )}

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Full Message</h4>
                        <div className="bg-slate-50 rounded-md p-3 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                          {step.message}
                        </div>
                        {step.sent > 0 && (
                          <div className="grid grid-cols-5 gap-3 mt-4">
                            <MetricBox label="Sent" value={step.sent} />
                            <MetricBox label="Opened" value={step.opened} rate={step.sent > 0 ? Math.round((step.opened / step.sent) * 100) : 0} />
                            <MetricBox label="Clicked" value={step.clicked} rate={step.opened > 0 ? Math.round((step.clicked / step.opened) * 100) : 0} />
                            <MetricBox label="Replied" value={step.replied} rate={step.sent > 0 ? Math.round((step.replied / step.sent) * 100) : 0} />
                            <MetricBox label="Booked" value={step.booked} rate={step.sent > 0 ? Math.round((step.booked / step.sent) * 100) : 0} highlight />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Recommendation */}
      {sequence.aiRecommendation && (
        <div className="max-w-3xl mx-auto mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Sparkles size={16} className="text-blue-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">AI Recommendation</h3>
              <p className="text-sm text-blue-800 leading-relaxed">{sequence.aiRecommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniMetric({ icon: Icon, value, highlight }) {
  return (
    <div className="flex items-center gap-1 text-xs text-slate-500">
      <Icon size={12} className={highlight ? 'text-green-600' : ''} />
      <span className={highlight ? 'font-medium text-green-700' : ''}>{value}</span>
    </div>
  );
}

function MetricBox({ label, value, rate, highlight }) {
  return (
    <div className={`rounded-lg p-3 text-center ${highlight ? 'bg-green-50 border border-green-200' : 'bg-white border border-slate-200'}`}>
      <div className={`text-lg font-semibold ${highlight ? 'text-green-700' : 'text-slate-900'}`}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
      {rate !== undefined && <div className={`text-xs font-medium mt-1 ${highlight ? 'text-green-600' : 'text-slate-600'}`}>{rate}%</div>}
    </div>
  );
}
