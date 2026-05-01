import { createContext, useContext, useState, useCallback } from 'react';
import { seedCalls, seedChatMessages } from '../utils/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentView, setCurrentView]  = useState('auth');
  const [activeNav,   setActiveNav]    = useState('dashboard');
  const [chatMessages,setChatMessages] = useState(seedChatMessages);
  const [calls,       setCalls]        = useState([]);
  const [toasts,      setToasts]       = useState([]);

  const showView = useCallback((name) => {
    setCurrentView(name);
    if (name === 'live') setCalls(seedCalls());
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const addToast = useCallback((msg, kind = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, kind }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3100);
  }, []);

  return (
    <AppContext.Provider value={{
      currentView, showView,
      activeNav, setActiveNav,
      chatMessages, setChatMessages,
      calls, setCalls,
      toasts, addToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
