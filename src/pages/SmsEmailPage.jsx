import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Mail, Plus, ArrowRight } from 'lucide-react';
import { mockSequences } from '../data/mockSequences';
import StatusBadge from '../components/shared/StatusBadge';
import { formatPercent } from '../utils/formatters';

const filterTabs = ['Active', 'Draft', 'Paused', 'All'];

const typeIcons = { sms: MessageSquare, email: Mail, both: Mail };
const typeLabels = { sms: 'SMS', email: 'Email', both: 'SMS + Email' };

export default function SmsEmailPage() {
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const filtered = filter === 'All'
    ? mockSequences
    : mockSequences.filter(s => s.status === filter.toLowerCase());

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">SMS & Email Sequences</h1>
        <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Plus size={16} />
          New Sequence
        </button>
      </div>

      <div className="flex gap-1 mb-6">
        {filterTabs.map(tab => {
          const count = tab === 'All' ? mockSequences.length : mockSequences.filter(s => s.status === tab.toLowerCase()).length;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === tab ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid gap-4">
        {filtered.map(seq => {
          const TypeIcon = typeIcons[seq.type];
          return (
            <div
              key={seq.id}
              onClick={() => navigate(`/sms-email/${seq.id}`)}
              className="bg-white rounded-lg border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
                    <TypeIcon size={20} className="text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-slate-900">{seq.name}</h3>
                      <StatusBadge status={seq.status} />
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {typeLabels[seq.type]}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{seq.steps.length} steps</span>
                      <span>Open rate: <span className="font-medium text-slate-700">{formatPercent(seq.openRate)}</span></span>
                      <span>Booking rate: <span className="font-medium text-slate-700">{formatPercent(seq.bookingRate)}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Mini step preview */}
                  <div className="hidden lg:flex items-center gap-1">
                    {seq.steps.map((step, i) => (
                      <div key={i} className="flex items-center">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          step.channel === 'sms' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {step.channel === 'sms' ? 'S' : 'E'}
                        </span>
                        {i < seq.steps.length - 1 && <div className="w-3 h-px bg-slate-300" />}
                      </div>
                    ))}
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-slate-900/70 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
