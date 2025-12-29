import React from 'react';
import { AppView } from '../types';
import { Home, MessageSquare, Mic, Calendar, Users, ClipboardList, Briefcase } from 'lucide-react';

interface BottomNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: AppView.DASHBOARD, icon: Home, label: 'Home' },
    { id: AppView.DEALS, icon: Briefcase, label: 'Pipeline' },
    { id: AppView.CALENDAR, icon: Calendar, label: 'Schedule' },
    { id: AppView.TASKS, icon: ClipboardList, label: 'Tasks' },
    { id: AppView.CHAT, icon: MessageSquare, label: 'Chat' },
  ];

  const handlePress = (view: AppView) => {
    // Haptic feedback if supported
    if (navigator.vibrate) navigator.vibrate(10);
    setView(view);
  };

  return (
    <div className="absolute bottom-0 w-full z-50">
        {/* Gradient fade for content scrolling under nav */}
        <div className="absolute bottom-full w-full h-12 bg-gradient-to-t from-slate-50/90 to-transparent pointer-events-none"></div>
        
        {/* Ultra Glass Background */}
        <div className="bg-white/75 backdrop-blur-[20px] border-t border-white/20 pb-safe-bottom pt-2 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
          <div className="flex justify-between items-center h-[64px] pb-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handlePress(item.id)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 group relative`}
                >
                   {/* Active Indicator Glow */}
                   {isActive && (
                       <div className="absolute -top-12 w-12 h-12 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                   )}

                  <div className={`relative p-2 rounded-2xl transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                      isActive ? '-translate-y-1' : 'translate-y-0'
                  }`}>
                     <item.icon 
                        className={`w-[26px] h-[26px] transition-all duration-300 ${
                            isActive ? 'text-indigo-600 fill-indigo-600/10 stroke-[2.5px]' : 'text-slate-400 stroke-[2px] group-hover:text-slate-500'
                        }`} 
                     />
                  </div>
                  <span className={`text-[10px] font-bold tracking-wide transition-all duration-300 ${
                      isActive ? 'text-indigo-600 translate-y-0 opacity-100' : 'text-slate-400 translate-y-2 opacity-0 hidden'
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Active Dot */}
                  <div className={`w-1 h-1 rounded-full bg-indigo-600 transition-all duration-300 mt-1 ${
                      isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}></div>
                </button>
              );
            })}
          </div>
        </div>
    </div>
  );
};

export default BottomNav;