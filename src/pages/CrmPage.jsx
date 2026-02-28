import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockContacts } from '../data/mockContacts';
import { PIPELINE_STAGES } from '../utils/constants';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';
import { CrmSkeleton } from '../components/shared/LoadingSkeleton';
import EmptyState from '../components/shared/EmptyState';
import {
  LayoutGrid,
  List,
  Search,
  ChevronDown,
  ChevronUp,
  Facebook,
  Search as SearchIcon,
  Globe,
  CheckSquare,
  Square,
  Users,
} from 'lucide-react';

const getScoreColor = (score) => {
  if (score >= 70) return 'bg-green-100 text-green-700';
  if (score >= 40) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
};

const getSourceIcon = (source) => {
  const s = source.toLowerCase();
  if (s.includes('facebook') || s.includes('instagram')) return Facebook;
  if (s.includes('google')) return SearchIcon;
  return Globe;
};

export default function CrmPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('pipeline');
  const [contacts, setContacts] = useState(mockContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [draggedContactId, setDraggedContactId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);
  const [dragOverStage, setDragOverStage] = useState(null);

  const uniqueSources = [...new Set(mockContacts.map(c => c.source))];

  // List view filtering & sorting
  const filteredContacts = contacts
    .filter(c => {
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (stageFilter !== 'all' && c.pipelineStage !== stageFilter) return false;
      if (sourceFilter !== 'all' && c.source !== sourceFilter) return false;
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'score': cmp = a.leadScore - b.leadScore; break;
        case 'lastContact': cmp = new Date(a.lastContact) - new Date(b.lastContact); break;
        case 'value': cmp = a.estimatedValue - b.estimatedValue; break;
        default: cmp = 0;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <ChevronDown size={12} className="text-slate-300" />;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">CRM</h1>
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setView('pipeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'pipeline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <LayoutGrid size={14} /> Pipeline
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <List size={14} /> List
          </button>
        </div>
      </div>

      {/* Pipeline (Kanban) View */}
      {view === 'pipeline' && loading && <CrmSkeleton />}
      {view === 'pipeline' && !loading && (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map(stage => {
            const stageContacts = contacts.filter(c => c.pipelineStage === stage);
            const isDragOver = dragOverStage === stage;
            return (
              <div
                key={stage}
                className={`w-72 flex-shrink-0 rounded-lg transition-colors ${isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : 'bg-slate-50'}`}
                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverStage(stage); }}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedContactId) {
                    setContacts(prev => prev.map(c => c.id === draggedContactId ? { ...c, pipelineStage: stage } : c));
                    setDraggedContactId(null);
                  }
                  setDragOverStage(null);
                }}
              >
                <div className="px-3 py-2 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{stage}</span>
                    <span className="text-xs text-slate-400 bg-slate-200 rounded-full px-1.5 py-0.5 font-medium">{stageContacts.length}</span>
                  </div>
                </div>
                <div className="p-2 space-y-2 min-h-[200px]">
                  {stageContacts.map(contact => {
                    const SourceIcon = getSourceIcon(contact.source);
                    return (
                      <div
                        key={contact.id}
                        draggable
                        onDragStart={(e) => { setDraggedContactId(contact.id); e.dataTransfer.effectAllowed = 'move'; }}
                        onDragEnd={() => { setDraggedContactId(null); setDragOverStage(null); }}
                        onClick={() => navigate(`/crm/${contact.id}`)}
                        className="bg-white rounded-lg border border-slate-200 p-3 cursor-pointer shadow-sm hover:shadow transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-slate-900 truncate">{contact.name}</span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${getScoreColor(contact.leadScore)}`}>{contact.leadScore}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <SourceIcon size={12} />
                          <span className="truncate">{formatCurrency(contact.estimatedValue)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">{formatRelativeTime(contact.lastContact)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div>
          {/* Filters */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stages</option>
              {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sources</option>
              {uniqueSources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-medium text-blue-600">{selectedIds.size} selected</span>
              <button className="ml-auto px-3 py-1 text-xs font-medium border border-blue-300 text-blue-600 rounded-md hover:bg-blue-100" onClick={() => console.log('Add to sequence')}>Add to Sequence</button>
              <button className="px-3 py-1 text-xs font-medium border border-blue-300 text-blue-600 rounded-md hover:bg-blue-100" onClick={() => console.log('Change stage')}>Change Stage</button>
              <button className="px-3 py-1 text-xs font-medium border border-blue-300 text-blue-600 rounded-md hover:bg-blue-100" onClick={() => console.log('Export')}>Export</button>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="w-10 px-3 py-2">
                    <button onClick={() => selectedIds.size === filteredContacts.length ? setSelectedIds(new Set()) : setSelectedIds(new Set(filteredContacts.map(c => c.id)))}>
                      {selectedIds.size === filteredContacts.length && filteredContacts.length > 0
                        ? <CheckSquare size={14} className="text-blue-600" />
                        : <Square size={14} className="text-slate-400" />}
                    </button>
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase cursor-pointer" onClick={() => handleSort('name')}>
                    <span className="flex items-center gap-1">Name <SortIcon col="name" /></span>
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase cursor-pointer" onClick={() => handleSort('score')}>
                    <span className="flex items-center gap-1">Score <SortIcon col="score" /></span>
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Stage</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Source</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase cursor-pointer" onClick={() => handleSort('lastContact')}>
                    <span className="flex items-center gap-1">Last Contact <SortIcon col="lastContact" /></span>
                  </th>
                  <th className="text-right px-3 py-2 text-xs font-semibold text-slate-500 uppercase cursor-pointer" onClick={() => handleSort('value')}>
                    <span className="flex items-center gap-1 justify-end">Est. Value <SortIcon col="value" /></span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map(contact => (
                  <tr
                    key={contact.id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/crm/${contact.id}`)}
                  >
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggleSelect(contact.id)}>
                        {selectedIds.has(contact.id) ? <CheckSquare size={14} className="text-blue-600" /> : <Square size={14} className="text-slate-400" />}
                      </button>
                    </td>
                    <td className="px-3 py-2.5 text-sm font-medium text-slate-900">{contact.name}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getScoreColor(contact.leadScore)}`}>{contact.leadScore}</span>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-slate-600">{contact.pipelineStage}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-600">{contact.source}</td>
                    <td className="px-3 py-2.5 text-xs text-slate-500">{formatRelativeTime(contact.lastContact)}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-900 text-right font-medium">{formatCurrency(contact.estimatedValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredContacts.length === 0 && (
              <EmptyState
                icon={Users}
                title="No contacts match your filters"
                description="Try adjusting your search or filter criteria."
                actionLabel="Clear Filters"
                onAction={() => { setSearchQuery(''); setStageFilter('all'); setSourceFilter('all'); }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
