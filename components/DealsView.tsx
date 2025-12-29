import React, { useState } from 'react';
import { Deal } from '../types';
import { MOCK_DEALS } from '../services/mockData';
import { Plus, DollarSign, Briefcase, TrendingUp, Calendar, ArrowRight, MoreHorizontal, CheckCircle2 } from 'lucide-react';

const DealsView: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);

  // Define Pipeline Stages
  const stages: { id: Deal['stage']; label: string; color: string }[] = [
    { id: 'New', label: 'New Lead', color: 'border-blue-500' },
    { id: 'Qualified', label: 'Qualified', color: 'border-indigo-500' },
    { id: 'Proposal', label: 'Proposal', color: 'border-purple-500' },
    { id: 'Negotiation', label: 'Negotiation', color: 'border-amber-500' },
    { id: 'Won', label: 'Closed Won', color: 'border-emerald-500' },
  ];

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(val);

  const calculateTotal = (stageId: string) => {
      return deals.filter(d => d.stage === stageId).reduce((acc, curr) => acc + curr.amount, 0);
  };

  const handleStageChange = (dealId: string, nextStage: Deal['stage']) => {
      setDeals(deals.map(d => d.id === dealId ? { ...d, stage: nextStage } : d));
  };

  const getNextStage = (current: Deal['stage']): Deal['stage'] | null => {
      const idx = stages.findIndex(s => s.id === current);
      return idx >= 0 && idx < stages.length - 1 ? stages[idx + 1].id : null;
  };

  const totalPipeline = deals.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-safe-top pb-4 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200/50 z-20">
            <div className="flex items-center justify-between mt-2">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pipeline</h1>
                    <div className="flex items-center gap-2 mt-1">
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Value:</span>
                         <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">{formatCurrency(totalPipeline)}</span>
                    </div>
                </div>
                <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all">
                    <Plus className="w-4 h-4" /> Deal
                </button>
            </div>
        </div>

        {/* Pipeline Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 whitespace-nowrap scroll-smooth">
            <div className="inline-flex h-full gap-4">
                {stages.map(stage => {
                    const stageDeals = deals.filter(d => d.stage === stage.id);
                    const stageTotal = calculateTotal(stage.id);

                    return (
                        <div key={stage.id} className="w-80 flex flex-col h-full">
                            {/* Column Header */}
                            <div className="mb-4">
                                <div className={`flex items-center justify-between border-b-2 pb-2 ${stage.color}`}>
                                    <span className="font-bold text-slate-700">{stage.label}</span>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{stageDeals.length}</span>
                                </div>
                                <div className="mt-1 flex justify-between items-center px-1">
                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Projected</span>
                                    <span className="text-xs font-bold text-slate-600">{formatCurrency(stageTotal)}</span>
                                </div>
                            </div>

                            {/* Drop Zone */}
                            <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-20">
                                {stageDeals.map(deal => (
                                    <div key={deal.id} className="bg-white p-4 rounded-[1.2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group whitespace-normal relative flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                                <Briefcase className="w-5 h-5" />
                                            </div>
                                            <button className="text-slate-300 hover:text-slate-600">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-900 text-[15px] leading-snug">{deal.title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">Skynet Inc</span>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-slate-50 flex items-center justify-between mt-auto">
                                            <span className="font-bold text-slate-900 text-lg">{formatCurrency(deal.amount)}</span>
                                            
                                            {/* Action Buttons */}
                                            {stage.id !== 'Won' && (
                                                <button 
                                                    onClick={() => {
                                                        const next = getNextStage(deal.stage);
                                                        if (next) handleStageChange(deal.id, next);
                                                    }}
                                                    className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white"
                                                    title="Advance Stage"
                                                >
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            )}
                                            {stage.id === 'Won' && (
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Date Tag */}
                                        <div className="absolute top-4 right-10 flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(deal.expectedClose).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                                        </div>
                                    </div>
                                ))}
                                
                                {stageDeals.length === 0 && (
                                    <div className="h-32 rounded-xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300">
                                        <span className="text-xs font-bold uppercase tracking-wider">No Deals</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default DealsView;