
import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, Users, MessageSquareText, Settings, Hexagon, Mic, Image as ImageIcon, RefreshCw, LogOut, ClipboardList, Briefcase, Calendar, FolderOpen, Zap, Bell, X } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout?: () => void;
  showMobileMenu?: boolean;
  closeMobileMenu?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, showMobileMenu, closeMobileMenu }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { id: AppView.DEALS, icon: Briefcase, label: 'Pipeline' },
    { id: AppView.TASKS, icon: ClipboardList, label: 'Tasks' },
    { id: AppView.CALENDAR, icon: Calendar, label: 'Schedule' },
    { id: AppView.DOCUMENTS, icon: FolderOpen, label: 'Documents' },
    { id: AppView.CONTACTS, icon: Users, label: 'Contacts' },
    { id: AppView.AUTOMATIONS, icon: Zap, label: 'Workflows' },
    { id: AppView.CHAT, icon: MessageSquareText, label: 'Assistant' },
    { id: AppView.NOTIFICATIONS, icon: Bell, label: 'Updates' },
    { id: AppView.LIVE, icon: Mic, label: 'Live Mode' },
  ];

  return (
    <>
        {/* Mobile Overlay */}
        {showMobileMenu && (
            <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm md:hidden animate-fade-in-up" onClick={closeMobileMenu}></div>
        )}

        <div className={`w-72 bg-slate-900/95 backdrop-blur-xl text-slate-300 flex flex-col h-full shrink-0 border-r border-slate-800 shadow-2xl overflow-hidden fixed md:relative z-50 transition-transform duration-300 ease-out ${
            showMobileMenu ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}>
        
        {/* Mobile Close Button */}
        <button onClick={closeMobileMenu} className="absolute top-4 right-4 md:hidden p-2 rounded-full bg-white/10 text-white z-50">
            <X className="w-5 h-5" />
        </button>

        {/* Background Ambience */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
            <div className="absolute top-40 right-[-100px] w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="p-8 flex items-center space-x-3 mb-2 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Hexagon className="w-6 h-6 text-white fill-white/20" />
            </div>
            <div>
                <span className="text-xl font-bold text-white tracking-tight block leading-none">KAA</span>
                <span className="text-xs font-semibold text-indigo-400 tracking-wider">CRM PRO</span>
            </div>
        </div>

        <div className="flex-1 px-4 space-y-1 relative z-10 overflow-y-auto no-scrollbar pb-6">
            {menuItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => {
                        setView(item.id);
                        if (closeMobileMenu) closeMobileMenu();
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium group ${
                        currentView === item.id 
                        ? 'bg-white/10 text-white shadow-lg border border-white/5' 
                        : 'hover:bg-white/5 hover:text-white text-slate-400'
                    }`}
                >
                    <item.icon className={`w-5 h-5 transition-colors ${currentView === item.id ? 'text-indigo-300' : 'text-slate-500 group-hover:text-indigo-300'}`} />
                    <span>{item.label}</span>
                    {currentView === item.id && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]"></div>
                    )}
                </button>
            ))}
        </div>

        {/* Sync Status for Desktop */}
        <div className="px-8 pb-2 text-xs font-medium text-slate-500 flex items-center gap-2">
            <RefreshCw className="w-3 h-3" />
            <span>Synced {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>

        <div className="p-4 relative z-10">
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 backdrop-blur-md hover:bg-slate-800 transition-colors group">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-slate-700 shadow-sm group-hover:scale-105 transition-transform"></div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">Alex Lewis</div>
                        <div className="text-xs text-slate-500 truncate group-hover:text-indigo-400 transition-colors">alex@kaa.com</div>
                    </div>
                    {onLogout ? (
                        <button onClick={onLogout} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Logout">
                            <LogOut className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                        </button>
                    ) : (
                        <Settings className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                    )}
                </div>
            </div>
        </div>
        </div>
    </>
  );
};

export default Sidebar;