import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Bell, ChevronDown, User, Settings, LogOut, Users, Megaphone, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockContacts } from '../../data/mockContacts';
import { mockCampaigns } from '../../data/mockCampaigns';
import NotificationPanel from '../shared/NotificationPanel';

const searchLandingPages = [
  { id: 'lp1', name: 'Kitchen Remodel — Main' },
  { id: 'lp2', name: 'Bath Renovation — Main' },
  { id: 'lp3', name: 'Kitchen Remodel — Variant B' },
  { id: 'lp4', name: 'Spring Promo Landing Page' },
  { id: 'lp5', name: 'Google Search — Remodel' },
  { id: 'lp6', name: 'New Design — Social Proof' },
];

export default function TopBar() {
  const { logout, notificationCount, setNotificationCount } = useApp();
  const navigate = useNavigate();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const avatarRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchQuery('');
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Escape closes search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSearchQuery('');
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    setAvatarOpen(false);
    logout();
    navigate('/login');
  };

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return null;
    const q = searchQuery.toLowerCase();

    const contacts = mockContacts
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map(c => ({ id: c.id, name: c.name, sub: c.pipelineStage, path: `/crm/${c.id}` }));

    const campaigns = mockCampaigns
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map(c => ({ id: c.id, name: c.name, sub: c.status, path: `/campaigns/${c.id}` }));

    const pages = searchLandingPages
      .filter(p => p.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map(p => ({ id: p.id, name: p.name, sub: 'Landing Page', path: `/landing-pages/${p.id}` }));

    return { contacts, campaigns, pages };
  }, [searchQuery]);

  const hasResults = searchResults && (searchResults.contacts.length > 0 || searchResults.campaigns.length > 0 || searchResults.pages.length > 0);

  const handleSearchSelect = (path) => {
    setSearchQuery('');
    navigate(path);
  };

  const renderSearchSection = (title, icon, items) => {
    if (items.length === 0) return null;
    const Icon = icon;
    return (
      <div>
        <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
            <Icon size={12} /> {title}
          </span>
        </div>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => handleSearchSelect(item.path)}
            className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm text-slate-900 truncate">{item.name}</span>
            <span className="text-xs text-slate-400 ml-2 flex-shrink-0">{item.sub}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
        {/* Search */}
        <div className="relative w-80" ref={searchRef}>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search contacts, campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Search Dropdown */}
          {searchResults && (
            <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
              {hasResults ? (
                <>
                  {renderSearchSection('Contacts', Users, searchResults.contacts)}
                  {renderSearchSection('Campaigns', Megaphone, searchResults.campaigns)}
                  {renderSearchSection('Pages', FileText, searchResults.pages)}
                </>
              ) : (
                <div className="px-3 py-6 text-center">
                  <p className="text-sm text-slate-500">No results found</p>
                  <p className="text-xs text-slate-400 mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* New Campaign Button */}
          <button
            onClick={() => navigate('/campaigns/new')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            New Campaign
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Avatar Dropdown */}
          <div className="relative ml-2" ref={avatarRef}>
            <button
              onClick={() => setAvatarOpen(!avatarOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-medium">
                JM
              </div>
            </button>

            {avatarOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={() => { setAvatarOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <User size={14} /> Profile
                </button>
                <button
                  onClick={() => { setAvatarOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Settings size={14} /> Settings
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        onMarkAllRead={() => setNotificationCount(0)}
      />
    </>
  );
}
