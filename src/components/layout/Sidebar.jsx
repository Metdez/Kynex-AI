import { Link, useLocation } from 'react-router-dom';
import {
  ClipboardCheck,
  LayoutDashboard,
  Megaphone,
  Phone,
  MessageSquare,
  Users,
  Inbox,
  Calendar,
  FileText,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, approvalCount, inboxUnreadCount } = useApp();

  const navItems = [
    { label: 'Approval Queue', icon: ClipboardCheck, path: '/', badge: approvalCount || null },
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Campaigns', icon: Megaphone, path: '/campaigns' },
    { label: 'Voice Agent', icon: Phone, path: '/voice-agent' },
    { label: 'SMS & Email', icon: MessageSquare, path: '/sms-email' },
    { label: 'CRM', icon: Users, path: '/crm' },
    { label: 'Inbox', icon: Inbox, path: '/inbox', badge: inboxUnreadCount || null },
    { label: 'Calendar', icon: Calendar, path: '/calendar' },
    { label: 'Landing Pages', icon: FileText, path: '/landing-pages' },
    { label: 'Activity Log', icon: Activity, path: '/activity-log' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-slate-900 border-r border-slate-800 text-white flex flex-col transition-all duration-300 z-30 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className={`${sidebarCollapsed ? 'h-16' : 'h-24'} flex items-center justify-center border-b border-slate-800 relative overflow-hidden`}>
        {sidebarCollapsed ? (
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0 relative z-10">
            K
          </div>
        ) : (
          <img
            src="/kynex-logo-light.png"
            alt="Kynex AI Logo"
            className="absolute h-[250px] max-w-none object-contain"
          />
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center h-10 px-3 text-sm font-medium rounded-md transition-colors relative group ${active
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              {active && !sidebarCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
              )}
              <Icon size={18} className={`flex-shrink-0 ${active ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'} ${sidebarCollapsed ? 'mx-auto' : ''}`} />

              {!sidebarCollapsed && (
                <span className="ml-3 truncate">{item.label}</span>
              )}

              {item.badge && !sidebarCollapsed && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 bg-blue-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}

              {item.badge && sidebarCollapsed && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-blue-500 rounded-full" />
              )}

              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="h-12 flex items-center justify-center border-t border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
      >
        {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
