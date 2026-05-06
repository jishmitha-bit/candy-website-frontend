import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { seedChatMessages } from '../utils/mockData';
import { loadStoredUser, logout as apiLogout, type AuthUser } from '../api/auth';
import { getToken } from '../api/client';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  // Hydrate from localStorage so a page reload doesn't kick the user back to login.
  const initialUser = (typeof window !== 'undefined') ? loadStoredUser() : null;
  const initialView = initialUser && getToken() ? 'dashboard' : 'auth';

  const [user, setUser]                = useState<AuthUser | null>(initialUser);
  const [currentView, setCurrentView]  = useState<string>(initialView);
  const [activeNav,   setActiveNav]    = useState('dashboard');
  const [chatMessages,setChatMessages] = useState(seedChatMessages);
  const [calls,       setCalls]        = useState([]);
  const [toasts,      setToasts]       = useState([]);

  const showView = useCallback((name) => {
    setCurrentView(name);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const addToast = useCallback((msg, kind = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, kind }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3100);
  }, []);

  const signedIn = useCallback((u: AuthUser) => {
    setUser(u);
    showView('dashboard');
  }, [showView]);

  const signOut = useCallback(() => {
    apiLogout();
    setUser(null);
    showView('auth');
  }, [showView]);

  // If the JWT was wiped (e.g. via devtools), drop back to the auth page.
  useEffect(() => {
    if (!user && currentView !== 'auth') {
      setCurrentView('auth');
    }
  }, [user, currentView]);

  // The api client dispatches this when any request returns 401. Clear the
  // user, drop the toast so the human knows what happened, and let the
  // useEffect above redirect to the auth page.
  useEffect(() => {
    function onAuthExpired() {
      setUser(null);
      addToast('Your session expired — please sign in again.', 'error');
      setCurrentView('auth');
    }
    window.addEventListener('candy:auth-expired', onAuthExpired);
    return () => window.removeEventListener('candy:auth-expired', onAuthExpired);
  }, [addToast]);

  return (
    <AppContext.Provider value={{
      user, signedIn, signOut,
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
