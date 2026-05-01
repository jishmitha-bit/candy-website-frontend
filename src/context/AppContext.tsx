import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { seedCalls, seedChatMessages } from '../utils/mockData';

const AppContext = createContext(null);

// Theme initialization — runs once during useState init, BEFORE first paint.
// Falls back to system preference if the user has never toggled.
function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function AppProvider({ children }) {
  const [currentView, setCurrentView]  = useState('auth');
  const [activeNav,   setActiveNav]    = useState('dashboard');
  const [chatMessages,setChatMessages] = useState(seedChatMessages);
  const [calls,       setCalls]        = useState([]);
  const [toasts,      setToasts]       = useState([]);
  const [theme,       setTheme]        = useState(getInitialTheme);

  // Sync theme to <html data-theme="…"> and localStorage whenever it changes.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

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
      theme, toggleTheme,
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
