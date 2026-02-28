import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/formatters';
import {
  AlertTriangle,
  TrendingDown,
  Calendar,
  UserPlus,
  Phone,
  MessageSquare,
  DollarSign,
  ClipboardCheck,
  X,
  CheckCheck,
} from 'lucide-react';

const iconMap = {
  AlertTriangle,
  TrendingDown,
  Calendar,
  UserPlus,
  Phone,
  MessageSquare,
  DollarSign,
  ClipboardCheck,
};

const initialNotifications = [
  {
    id: 'notif1',
    title: 'Budget ceiling reached',
    description: 'Kitchen Remodel Facebook hit daily $200 cap by 2pm. Increase recommended.',
    timestamp: '2026-02-28T14:00:00',
    icon: 'AlertTriangle',
    urgent: true,
    unread: true,
  },
  {
    id: 'notif2',
    title: 'Ad creative fatigue detected',
    description: '"Your Neighbor Just Remodeled" CTR dropped 40% in 7 days.',
    timestamp: '2026-02-28T09:30:00',
    icon: 'TrendingDown',
    urgent: true,
    unread: true,
  },
  {
    id: 'notif3',
    title: 'High-value lead booked',
    description: 'Jennifer Walsh ($48K) booked consultation for Monday 11am.',
    timestamp: '2026-02-27T14:35:00',
    icon: 'Calendar',
    urgent: true,
    unread: false,
  },
  {
    id: 'notif4',
    title: 'New lead captured',
    description: 'Sarah Mitchell submitted kitchen remodel form from Facebook ad.',
    timestamp: '2026-02-28T10:22:00',
    icon: 'UserPlus',
    urgent: false,
    unread: true,
  },
  {
    id: 'notif5',
    title: 'Voice agent booked call',
    description: 'Sarah Mitchell consultation scheduled for Thursday 2pm.',
    timestamp: '2026-02-28T10:18:00',
    icon: 'Phone',
    urgent: false,
    unread: true,
  },
  {
    id: 'notif6',
    title: 'Sequence step sent',
    description: 'Welcome SMS sent to Linda Zhao (New Lead Welcome, Step 1).',
    timestamp: '2026-02-28T07:55:00',
    icon: 'MessageSquare',
    urgent: false,
    unread: false,
  },
  {
    id: 'notif7',
    title: 'Budget reallocation complete',
    description: 'Shifted $50/day from Spring Promo to Kitchen Remodel Facebook.',
    timestamp: '2026-02-27T08:00:00',
    icon: 'DollarSign',
    urgent: false,
    unread: false,
  },
  {
    id: 'notif8',
    title: 'New approval item queued',
    description: '3 new ad variations for Kitchen Remodel pending your review.',
    timestamp: '2026-02-28T08:30:00',
    icon: 'ClipboardCheck',
    urgent: false,
    unread: false,
  },
];

export default function NotificationPanel({ isOpen, onClose, onMarkAllRead }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    onMarkAllRead();
  };

  const handleViewAll = () => {
    onClose();
    navigate('/activity-log');
  };

  const urgentItems = notifications.filter(n => n.urgent);
  const todayItems = notifications.filter(n => !n.urgent);

  const renderItem = (notif) => {
    const Icon = iconMap[notif.icon] || AlertTriangle;
    return (
      <div
        key={notif.id}
        className={`flex items-start gap-3 p-3 hover:bg-slate-50 transition-colors ${
          notif.urgent ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-transparent'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          notif.urgent ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
        }`}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-900 truncate">{notif.title}</span>
            {notif.unread && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.description}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">{formatRelativeTime(notif.timestamp)}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-30" onClick={onClose} />
      )}

      {/* Panel */}
      <div
        className={`fixed top-14 right-0 w-96 h-[calc(100vh-3.5rem)] bg-white border-l border-slate-200 shadow-xl z-40 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-600 font-medium"
            >
              <CheckCheck size={12} /> Mark All Read
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900/70 rounded">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Urgent Section */}
          {urgentItems.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-red-50">
                <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Urgent</span>
              </div>
              {urgentItems.map(renderItem)}
            </div>
          )}

          {/* Today Section */}
          {todayItems.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-slate-50">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Today</span>
              </div>
              {todayItems.map(renderItem)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-3">
          <button
            onClick={handleViewAll}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-600 font-medium py-1"
          >
            View All Activity
          </button>
        </div>
      </div>
    </>
  );
}
