import React, { useState } from 'react';
import { MOCK_EVENTS } from '../services/mockData';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const todayEvents = MOCK_EVENTS.filter(e => 
    e.start.getDate() === currentDate.getDate() && 
    e.start.getMonth() === currentDate.getMonth()
  );

  const upcomingEvents = MOCK_EVENTS.filter(e => e.start > new Date());

  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

  const getEventForHour = (hour: number) => {
      return todayEvents.find(e => e.start.getHours() === hour);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-safe-top pb-4 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200/50 z-20">
             <div className="flex items-center justify-between mt-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Schedule</h1>
                <button className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all">
                    <Plus className="w-5 h-5" />
                </button>
            </div>
            
            {/* Date Selector */}
            <div className="flex items-center justify-between mt-6 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))} className="p-2 hover:bg-slate-50 rounded-full">
                    <ChevronLeft className="w-5 h-5 text-slate-500" />
                </button>
                <div className="text-center">
                    <h3 className="text-sm font-bold text-slate-900">{currentDate.toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                    <p className="text-xs text-slate-500 font-medium">{currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                </div>
                <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))} className="p-2 hover:bg-slate-50 rounded-full">
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                </button>
            </div>
        </div>

        {/* Timeline View */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {hours.map(hour => {
                const event = getEventForHour(hour);
                const isCurrentHour = new Date().getHours() === hour && new Date().getDate() === currentDate.getDate();
                
                return (
                    <div key={hour} className="flex gap-4 relative group">
                        {/* Time Column */}
                        <div className="w-12 text-xs font-bold text-slate-400 pt-2 shrink-0 text-right">
                            {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                        </div>

                        {/* Event Card */}
                        <div className="flex-1 min-h-[5rem] relative">
                            {/* Current Time Indicator */}
                            {isCurrentHour && (
                                <div className="absolute top-0 -left-[22px] w-3 h-3 rounded-full bg-red-500 border-2 border-slate-50 z-10"></div>
                            )}
                            {isCurrentHour && (
                                <div className="absolute top-1.5 -left-[18px] w-full h-px bg-red-500/50 z-0"></div>
                            )}

                            {event ? (
                                <div className={`p-4 rounded-2xl border-l-4 shadow-sm animate-fade-in-up hover:shadow-md transition-all cursor-pointer ${
                                    event.type === 'MEETING' ? 'bg-indigo-50 border-indigo-500 text-indigo-900' :
                                    event.type === 'CALL' ? 'bg-blue-50 border-blue-500 text-blue-900' :
                                    'bg-amber-50 border-amber-500 text-amber-900'
                                }`}>
                                    <h4 className="font-bold text-sm mb-1">{event.title}</h4>
                                    <div className="flex items-center gap-3 text-xs opacity-80">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {event.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {event.participants.length}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full border-t border-slate-100 group-hover:bg-slate-50/50 transition-colors rounded-lg"></div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default CalendarView;