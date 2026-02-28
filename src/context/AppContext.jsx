import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);
  const [approvalCount, setApprovalCount] = useState(8);
  const [inboxUnreadCount, setInboxUnreadCount] = useState(3);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      sidebarCollapsed,
      toggleSidebar,
      notificationCount,
      setNotificationCount,
      approvalCount,
      setApprovalCount,
      inboxUnreadCount,
      setInboxUnreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
