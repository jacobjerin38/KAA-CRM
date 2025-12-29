import React, { useState } from 'react';
import { MOCK_NOTIFICATIONS } from '../services/mockData';
import { Bell, Check, Clock, AlertTriangle, Info, CheckCircle2, Trash2 } from 'lucide-react';

const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markRead = (id: string) => {
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => setNotifications([]);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-safe-top pb-4 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200/50 z-20">
             <div className="flex items-center justify-between mt-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Updates</h1>
                <button onClick={clearAll} className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 pb-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                        <Bell className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="font-medium">All caught up!</p>
                </div>
            ) : (
                notifications.map((notif) => (
                    <div 
                        key={notif.id} 
                        onClick={() => markRead(notif.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${
                            notif.read 
                            ? 'bg-slate-50 border-transparent opacity-60' 
                            : 'bg-white border-slate-100 shadow-sm border-l-4 border-l-indigo-500'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            notif.type === 'SUCCESS' ? 'bg-green-100 text-green-600' :
                            notif.type === 'ALERT' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                            {notif.type === 'SUCCESS' ? <CheckCircle2 className="w-5 h-5" /> :
                             notif.type === 'ALERT' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`text-sm font-bold ${notif.read ? 'text-slate-600' : 'text-slate-900'}`}>{notif.title}</h4>
                                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                    {new Date().getHours() - notif.timestamp.getHours() < 24 
                                    ? notif.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                                    : 'Yesterday'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                        </div>
                        {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5"></div>
                        )}
                    </div>
                ))
            )}
        </div>
    </div>
  );
};

export default NotificationsView;