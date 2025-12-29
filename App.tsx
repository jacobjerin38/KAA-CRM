import React, { useState, useEffect } from 'react';
import { AppView } from './types';
import Dashboard from './components/Dashboard';
import ChatView from './components/ChatView';
import ContactsView from './components/ContactsView';
import LiveView from './components/LiveView';
import LoginView from './components/LoginView';
import TasksView from './components/TasksView';
import DealsView from './components/DealsView';
import CalendarView from './components/CalendarView';
import DocumentsView from './components/DocumentsView';
import AutomationsView from './components/AutomationsView';
import NotificationsView from './components/NotificationsView';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Check for existing session token
    const checkAuth = async () => {
        // In a real Node app, this would verify the token with an API
        const token = localStorage.getItem('kaa_token');
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate splash screen
        if (token) {
            setIsAuthenticated(true);
        }
        setCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('kaa_token');
    setIsAuthenticated(false);
    setCurrentView(AppView.DASHBOARD);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard setAppView={setCurrentView} toggleMobileMenu={() => setShowMobileMenu(true)} />;
      case AppView.DEALS:
        return <DealsView />;
      case AppView.CALENDAR:
        return <CalendarView />;
      case AppView.DOCUMENTS:
        return <DocumentsView />;
      case AppView.CONTACTS:
        return <ContactsView />;
      case AppView.TASKS:
        return <TasksView />;
      case AppView.AUTOMATIONS:
        return <AutomationsView />;
      case AppView.NOTIFICATIONS:
        return <NotificationsView />;
      case AppView.ASSISTANT:
      case AppView.CHAT:
        return <ChatView />;
      case AppView.LIVE:
        return <LiveView />;
      default:
        return <Dashboard />;
    }
  };

  if (checkingAuth) {
      return (
        <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-600/10 animate-pulse"></div>
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl mb-4 relative z-10 animate-fade-in-up">
                <svg className="w-8 h-8 text-white fill-white/20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            </div>
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin z-10" />
        </div>
      );
  }

  if (!isAuthenticated) {
      return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="h-[100dvh] bg-nexus-900 w-full relative flex overflow-hidden">
      
      {/* Sidebar - Desktop & Mobile Drawer */}
      <Sidebar 
          currentView={currentView} 
          setView={setCurrentView} 
          onLogout={handleLogout} 
          showMobileMenu={showMobileMenu}
          closeMobileMenu={() => setShowMobileMenu(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative z-0 flex flex-col bg-slate-50">
         <div className="flex-1 w-full relative">
             {/* View Transition Wrapper */}
             <div key={currentView} className="h-full w-full animate-page-enter">
                {renderView()}
             </div>
         </div>
      </main>

      {/* Mobile Bottom Nav - Hidden on Tablet/Desktop */}
      <div className="md:hidden animate-slide-up">
        <BottomNav currentView={currentView} setView={setCurrentView} />
      </div>

    </div>
  );
};

export default App;