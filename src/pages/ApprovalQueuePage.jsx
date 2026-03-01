import React, { useState } from 'react';
import { mockApprovalQueue } from '../data/mockApprovalQueue';
import StatusBadge from '../components/shared/StatusBadge';
import ApprovalActions from '../components/shared/ApprovalActions';
import { ChevronDown, ChevronUp, AlertCircle, Clock, Trash2, CheckSquare, Bot } from 'lucide-react';

const TABS = ['All', 'Ads', 'Landing Pages', 'Scripts', 'Sequences', 'Urgent'];

const TYPE_TO_TAB = {
  'ad_creative': 'Ads',
  'landing_page': 'Landing Pages',
  'call_script': 'Scripts',
  'email_sequence': 'Sequences',
  'budget_change': 'Ads',
  'audience_expansion': 'Ads',
};

const TAB_TO_TYPES = {
  'Ads': ['ad_creative', 'budget_change', 'audience_expansion'],
  'Landing Pages': ['landing_page'],
  'Scripts': ['call_script'],
  'Sequences': ['email_sequence'],
};

export default function ApprovalQueuePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [queueItems, setQueueItems] = useState(mockApprovalQueue);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [animatingOut, setAnimatingOut] = useState(new Set());

  // Filtering
  const filteredItems = queueItems.filter(item => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Urgent') return item.urgency === 'high';
    return TAB_TO_TYPES[activeTab]?.includes(item.type);
  });

  // Tab Counts
  const getTabCount = (tabName) => {
    if (tabName === 'All') return queueItems.length;
    if (tabName === 'Urgent') return queueItems.filter(i => i.urgency === 'high').length;
    const types = TAB_TO_TYPES[tabName] || [];
    return queueItems.filter(i => types.includes(i.type)).length;
  };

  // Selection
  const handleSelectAll = () => {
    if (selectedIds.size === filteredItems.length && filteredItems.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map(i => i.id)));
    }
  };

  const toggleSelection = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedIds(newExpanded);
  };

  // Actions
  const handleApprove = (id) => {
    triggerRemoveAnimation([id]);
  };

  const handleRejectInit = (id) => {
    setRejectingId(id);
    setRejectNote('');
  };

  const submitReject = (id) => {
    triggerRemoveAnimation([id]);
    setRejectingId(null);
  };

  const handleEdit = (id) => {
    const newExpanded = new Set(expandedIds);
    newExpanded.add(id);
    setExpandedIds(newExpanded);
    // In a real app we'd track edit mode, but for the demo, expansion is enough to imply editing capability
  };

  const handleBatchApprove = () => {
    triggerRemoveAnimation(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleBatchDismiss = () => {
    triggerRemoveAnimation(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const triggerRemoveAnimation = (ids) => {
    const newAnimating = new Set(animatingOut);
    ids.forEach(id => newAnimating.add(id));
    setAnimatingOut(newAnimating);

    // Remove after animation completes
    setTimeout(() => {
      setQueueItems(prev => prev.filter(item => !ids.includes(item.id)));
      setAnimatingOut(prev => {
        const next = new Set(prev);
        ids.forEach(id => next.delete(id));
        return next;
      });
      // also remove from selected
      setSelectedIds(prev => {
        const next = new Set(prev);
        ids.forEach(id => next.delete(id));
        return next;
      });
    }, 300);
  };

  const renderPreviewContent = (item) => {
    const content = item.previewContent;

    switch (item.type) {
      case 'ad_creative':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {content.variations.map((v, i) => (
              <div key={i} className="border border-slate-200 rounded-md p-3 bg-white">
                <div className="font-semibold text-sm mb-1">{v.headline}</div>
                <div className="text-xs text-slate-600 mb-2">{v.body}</div>
                <div className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 inline-block px-2 py-1 rounded">CTA: {v.cta}</div>
                {v.imageDesc && <div className="text-xs italic text-slate-500 mt-2">🖼️ {v.imageDesc}</div>}
              </div>
            ))}
          </div>
        );
      case 'landing_page':
        return (
          <div className="mt-4 border border-slate-200 rounded-md bg-white overflow-hidden text-sm">
            {content.sections.map((s, i) => (
              <div key={i} className={`p-3 border-b border-slate-200 last:border-0 ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                <span className="font-semibold text-slate-900 mr-2">{s.title}:</span>
                <span className="text-slate-600">{s.content}</span>
              </div>
            ))}
          </div>
        );
      case 'call_script':
        return (
          <div className="mt-4 border-l-2 border-blue-200 pl-4 py-1 space-y-4 text-sm">
            {content.blocks.map((b, i) => (
              <div key={i}>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{b.type}</div>
                <div className="text-slate-800 whitespace-pre-wrap">{b.content}</div>
              </div>
            ))}
          </div>
        );
      case 'email_sequence':
        return (
          <div className="mt-4 space-y-2">
            {content.emails.map((e, i) => (
              <div key={i} className="flex gap-3 bg-white border border-slate-200 rounded block p-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">{i + 1}</div>
                <div>
                  <div className="font-medium text-sm text-slate-900">{e.subject}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{e.preview}</div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'budget_change':
        return (
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded overflow-hidden">
              <div className="bg-slate-100 text-xs font-bold px-3 py-1.5 uppercase tracking-wide text-slate-500 border-b border-slate-200">Current</div>
              <div className="p-3 text-sm">
                <div className="flex justify-between mb-1"><span className="text-slate-500">Daily Budget</span><span className="font-semibold">${content.current.dailyBudget}</span></div>
                <div className="flex justify-between mb-1"><span className="text-slate-500">Monthly Cost</span><span className="font-semibold">${content.current.monthlyCost}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Est. Leads</span><span className="font-semibold">{content.current.estimatedLeads}</span></div>
              </div>
            </div>
            <div className="flex items-center justify-center text-slate-300 px-2">→</div>
            <div className="flex-1 bg-blue-50 border border-blue-200 rounded overflow-hidden">
              <div className="bg-blue-100/50 text-xs font-bold px-3 py-1.5 uppercase tracking-wide text-blue-700 border-b border-blue-200">Proposed</div>
              <div className="p-3 text-sm">
                <div className="flex justify-between mb-1"><span className="text-blue-700">Daily Budget</span><span className="font-semibold text-blue-900">${content.proposed.dailyBudget}</span></div>
                <div className="flex justify-between mb-1"><span className="text-blue-700">Monthly Cost</span><span className="font-semibold text-blue-900">${content.proposed.monthlyCost}</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Est. Leads</span><span className="font-semibold text-blue-900">{content.proposed.estimatedLeads}</span></div>
              </div>
            </div>
          </div>
        );
      case 'audience_expansion':
        return (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="border border-slate-200 rounded overflow-hidden">
              <div className="bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 border-b border-slate-200">Current Audiences</div>
              <ul className="divide-y divide-slate-100">
                {content.current.map((a, i) => (
                  <li key={i} className="p-2 flex justify-between items-center bg-white"><span className="text-slate-800">{a.name}</span> <span className="text-slate-400 text-xs">{(a.size / 1000).toFixed(0)}k</span></li>
                ))}
              </ul>
            </div>
            <div className="border border-blue-200 rounded overflow-hidden">
              <div className="bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 border-b border-blue-200">Proposed Audiences</div>
              <ul className="divide-y divide-blue-50">
                {content.proposed.map((a, i) => (
                  <li key={i} className={`p-2 flex justify-between items-center ${a.isNew ? 'bg-green-50' : 'bg-white'}`}>
                    <span className={a.isNew ? 'text-green-800 font-medium flex items-center gap-1.5' : 'text-slate-800'}>
                      {a.isNew && <span className="bg-green-200 text-green-700 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">NEW</span>}
                      {a.name}
                    </span>
                    <span className="text-slate-400 text-xs">{(a.size / 1000).toFixed(0)}k</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      default:
        return <div className="mt-4 text-sm text-slate-400 italic">Preview not available</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">AI Approval Queue</h1>
        <div className="text-sm font-medium text-slate-500">
          <span className="text-slate-900 font-bold">{queueItems.length}</span> items waiting
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 mb-4 pb-0.5">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedIds(new Set()); }}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
          >
            {tab}
            <span className={`ml-2 text-xs py-0.5 px-2 rounded-full ${activeTab === tab ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
              }`}>
              {getTabCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* Batch Actions */}
      <div className={`flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg mb-4 transition-all ${selectedIds.size > 0 ? 'opacity-100 min-h-[56px]' : 'opacity-0 h-0 overflow-hidden py-0 border-transparent mb-0'
        }`}>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectedIds.size === filteredItems.length && filteredItems.length > 0}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-blue-800">{selectedIds.size} selected</span>
        </div>
        <div className="flex gap-2">
          <button onClick={handleBatchApprove} className="px-3 py-1.5 text-sm font-medium bg-white border border-slate-200 rounded-md shadow-sm text-green-700 hover:bg-green-50 transition-colors flex items-center gap-1">
            <CheckSquare size={14} /> Approve Selected
          </button>
          <button onClick={handleBatchDismiss} className="px-3 py-1.5 text-sm font-medium bg-white border border-slate-200 rounded-md shadow-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1">
            <Trash2 size={14} /> Dismiss
          </button>
        </div>
      </div>

      {/* Select All (when batch bar is hidden) */}
      {selectedIds.size === 0 && filteredItems.length > 0 && (
        <div className="flex items-center gap-3 px-4 mb-3">
          <input
            type="checkbox"
            checked={false}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm text-slate-500 font-medium select-none">Select All</span>
        </div>
      )}

      {/* Queue List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-400 mb-3">
              <CheckSquare size={24} />
            </div>
            <h3 className="text-sm font-medium text-slate-900 mb-1">You're all caught up</h3>
            <p className="text-sm text-slate-500">No items in this queue need your attention.</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const isSelected = selectedIds.has(item.id);
            const isExpanded = expandedIds.has(item.id);
            const isRejecting = rejectingId === item.id;
            const isAnimating = animatingOut.has(item.id);

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-lg transition-all duration-300 ${isSelected ? 'border-blue-400 ring-1 ring-blue-400' : 'border-slate-200 hover:border-slate-300 shadow-sm'
                  } ${isAnimating ? 'opacity-0 scale-95 h-0 overflow-hidden border-transparent mb-0' : 'opacity-100 scale-100'}`}
              >
                {/* Card Header (Always visible) */}
                <div
                  className="p-4 flex flex-col md:flex-row gap-4 md:items-start cursor-pointer"
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="flex gap-4 flex-1">
                    {/* Checkbox */}
                    <div className="pt-1" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(item.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <StatusBadge status={item.type} />
                        {item.urgency === 'high' && <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-red-600 bg-red-50 px-1.5 py-0.5 rounded"><span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span> Urgent</span>}
                        {item.urgency === 'medium' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Medium Priority"></span>}
                        <span className="text-xs text-slate-500 flex items-center gap-1 ml-auto"><Clock size={12} /> {item.createdAt.split('T')[1].substring(0, 5)}</span>
                      </div>
                      <h3 className="font-semibold text-sm text-slate-900 mb-1 leading-tight">{item.title}</h3>
                      <div className="flex gap-2 items-start mt-2">
                        <div className="text-indigo-500 mt-0.5"><Bot size={14} /></div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-snug">
                          {item.aiReasoning}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Expand */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 mt-4 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <ApprovalActions
                      onApprove={(e) => { e?.stopPropagation(); handleApprove(item.id); }}
                      onEdit={(e) => { e?.stopPropagation(); handleEdit(item.id); }}
                      onReject={(e) => { e?.stopPropagation(); handleRejectInit(item.id); }}
                    />
                    <button
                      onClick={(e) => { e?.stopPropagation(); toggleExpand(item.id); }}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors hidden md:block"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Rejecting State */}
                {isRejecting && (
                  <div className="border-t border-red-100 bg-red-50 px-4 md:px-12 py-3 flex flex-col md:flex-row gap-3 items-center">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Why are you rejecting this? (optional)"
                      className="flex-1 w-full border border-red-200 rounded shadow-sm text-sm focus:ring-red-500 focus:border-red-500 px-3 py-1.5"
                      value={rejectNote}
                      onChange={(e) => setRejectNote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitReject(item.id)}
                    />
                    <div className="flex gap-2 w-full md:w-auto">
                      <button onClick={() => submitReject(item.id)} className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-4 py-1.5 rounded shadow-sm transition-colors whitespace-nowrap">Confirm Reject</button>
                      <button onClick={() => setRejectingId(null)} className="flex-1 md:flex-none text-slate-600 hover:text-slate-900 text-sm font-medium px-4 md:px-2 bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50">Cancel</button>
                    </div>
                  </div>
                )}

                {/* Expanded Content Preview */}
                {isExpanded && !isRejecting && (
                  <div className="border-t border-slate-100 bg-slate-50 px-4 pb-4 pt-4 md:ml-12 md:mr-4 rounded-b-lg">
                    {/* Full Reason Text */}
                    <div className="text-xs text-slate-700 mb-4 bg-white p-3 rounded border border-slate-200 leading-relaxed">
                      <span className="font-semibold text-slate-900 block mb-1 flex items-center gap-1.5"><Bot size={14} className="text-indigo-500" /> Full AI Reasoning:</span>
                      {item.aiReasoning}
                    </div>

                    {renderPreviewContent(item)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
