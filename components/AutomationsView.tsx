import React, { useState } from 'react';
import { MOCK_AUTOMATIONS } from '../services/mockData';
import { Zap, Play, Pause, Plus, ArrowRight, Settings2 } from 'lucide-react';

const AutomationsView: React.FC = () => {
  const [rules, setRules] = useState(MOCK_AUTOMATIONS);

  const toggleRule = (id: string) => {
      setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-safe-top pb-6 bg-slate-900 text-white z-20 rounded-b-[2rem] shadow-xl">
            <div className="flex items-center justify-between mt-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
                    <p className="text-slate-400 text-sm font-medium mt-1">Automate your sales process</p>
                </div>
                <button className="w-12 h-12 rounded-full bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/50 active:scale-95 transition-all">
                    <Plus className="w-6 h-6" />
                </button>
            </div>
            
            <div className="mt-8 flex gap-4">
                <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Play className="w-5 h-5 text-green-400 fill-current" />
                    </div>
                    <div>
                        <div className="text-xl font-bold">{rules.filter(r => r.active).length}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Active</div>
                    </div>
                </div>
                <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-center gap-3">
                     <div className="w-10 h-10 rounded-lg bg-slate-500/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                        <div className="text-xl font-bold">{rules.length}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Total</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {rules.map((rule) => (
                <div key={rule.id} className={`bg-white p-5 rounded-2xl shadow-sm border transition-all ${rule.active ? 'border-indigo-100' : 'border-slate-100 opacity-75'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rule.active ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                <Zap className="w-5 h-5 fill-current" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{rule.name}</h3>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rule.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {rule.active ? 'Running' : 'Paused'}
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => toggleRule(rule.id)}
                            className={`w-12 h-7 rounded-full p-1 transition-colors relative ${rule.active ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${rule.active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded shadow-sm border border-slate-200">
                            IF
                        </span>
                        <span className="text-xs font-medium text-slate-500 truncate flex-1">{rule.trigger}</span>
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                         <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded shadow-sm border border-indigo-100">
                            THEN
                        </span>
                        <span className="text-xs font-medium text-slate-500 truncate flex-1">{rule.action}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default AutomationsView;