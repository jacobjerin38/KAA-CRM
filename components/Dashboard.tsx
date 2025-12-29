import React, { useEffect, useState } from 'react';
import { generatePipelineInsight } from '../services/geminiService';
import { getDashboardSummary } from '../services/mockData';
import { TrendingUp, Users, DollarSign, Activity, Sparkles, Bell, Phone, CheckCircle2, ArrowUpRight, ChevronDown, Trophy, RefreshCw, Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [insight, setInsight] = useState("Analyzing pipeline...");
  const [filterPeriod, setFilterPeriod] = useState("month");
  const [filterOwner, setFilterOwner] = useState<'me'|'all'>("me");
  const [scrolled, setScrolled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const data = getDashboardSummary(filterOwner, filterPeriod);

  useEffect(() => {
    // Simulate data fetch latency
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
    }, 600);
    
    generatePipelineInsight(data).then(setInsight);
  }, [filterPeriod, filterOwner]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      setScrolled(e.currentTarget.scrollTop > 10);
  };

  const handleRefresh = () => {
      setIsRefreshing(true);
      // Simulate network request
      setTimeout(() => {
          setIsRefreshing(false);
          // Re-trigger insight generation for effect
          setInsight("Updating analysis...");
          generatePipelineInsight(data).then(setInsight);
      }, 1500);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(val);
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  if (loading) {
      return (
          <div className="flex flex-col h-full bg-slate-50 p-6 pt-safe-top">
              <div className="h-8 w-40 bg-slate-200 rounded-lg animate-pulse mb-6 mt-12"></div>
              <div className="h-48 w-full bg-slate-200 rounded-[2rem] animate-pulse mb-6"></div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-slate-200 rounded-[2rem] animate-pulse"></div>
                  <div className="h-32 bg-slate-200 rounded-[2rem] animate-pulse"></div>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 relative" onScroll={handleScroll}>
      {/* Sticky Header */}
      <div className={`absolute top-0 left-0 right-0 z-20 px-6 pt-safe-top pb-3 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm' : 'bg-transparent'}`}>
        <div className="flex justify-between items-center mt-2">
            <div>
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                   {currentDate}
                   {isRefreshing && <span className="text-indigo-500 font-bold animate-pulse">• Syncing</span>}
               </p>
               <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={handleRefresh}
                    className={`w-10 h-10 rounded-full bg-white/50 border border-slate-200 shadow-sm flex items-center justify-center active:scale-95 transition-all backdrop-blur-sm hover:bg-white ${isRefreshing ? 'text-indigo-600' : 'text-slate-600'}`}
                >
                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/50 border border-slate-200 shadow-sm flex items-center justify-center active:scale-95 transition-transform backdrop-blur-sm hover:bg-white relative">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                </button>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto smooth-scroll px-5 pt-28 pb-32 space-y-6 no-scrollbar" onScroll={handleScroll}>
        
        {/* Filter Scroll - Horizontal on Mobile, Grid on Tablet */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 py-1 md:mx-0 md:px-0 md:flex-wrap">
            <FilterChip label="This Month" active={filterPeriod === 'month'} onClick={() => setFilterPeriod('month')} />
            <FilterChip label="This Quarter" active={filterPeriod === 'quarter'} onClick={() => setFilterPeriod('quarter')} />
            <div className="w-px h-5 bg-slate-200 mx-1 self-center hidden md:block"></div>
            <FilterChip label="My Deals" active={filterOwner === 'me'} onClick={() => setFilterOwner('me')} />
            <FilterChip label="Team View" active={filterOwner === 'all'} onClick={() => setFilterOwner('all')} />
        </div>

        {/* AI Insight Card - Premium Glass */}
        <div className="relative overflow-hidden rounded-[2rem] p-6 shadow-xl shadow-indigo-500/10 group animate-fade-in-up">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-colors duration-700"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Gemini Insight</span>
                    </div>
                </div>
                <p className="text-[15px] font-medium leading-relaxed text-indigo-50/95 tracking-wide">
                    {insight}
                </p>
            </div>
        </div>

        {/* KPI Grid - Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
             <StatCard 
                icon={TrendingUp} 
                label="Pipeline Value" 
                value={formatCurrency(data.pipelineValue)} 
                trend="+12%"
                color="text-indigo-600" 
                bg="bg-indigo-50"
             />
             <StatCard 
                icon={DollarSign} 
                label="Revenue Won" 
                value={formatCurrency(data.wonValue)} 
                trend="+5%"
                color="text-emerald-600" 
                bg="bg-emerald-50"
             />
             <StatCard 
                icon={Users} 
                label="New Leads" 
                value={data.newLeads.toString()} 
                trend="+8"
                color="text-blue-600" 
                bg="bg-blue-50"
             />
             <StatCard 
                icon={Activity} 
                label="Action Items" 
                value={data.openActivities.toString()} 
                trend="-2"
                color="text-amber-600" 
                bg="bg-amber-50"
             />
        </div>

        {/* Team Leaderboard (Conditional) */}
        {filterOwner === 'all' && data.teamMembers.length > 0 && (
            <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <div className="flex items-center justify-between px-2 mb-4">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500 fill-amber-500" />
                        Team Leaderboard
                    </h3>
                </div>
                {/* Responsive Grid for Team */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.teamMembers.sort((a,b) => b.revenue - a.revenue).map((member, i) => (
                        <div key={member.id} className="bg-white rounded-[1.5rem] p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors border border-slate-100 shadow-sm">
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${member.avatar}`}>
                                    {member.name.charAt(0)}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white text-[10px] font-bold ${
                                    i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-400 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {i + 1}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-slate-900 truncate">{member.name}</h4>
                                    <span className="font-bold text-slate-900">{formatCurrency(member.revenue)}</span>
                                </div>
                                <div className="flex justify-between items-center mt-0.5">
                                    <span className="text-xs text-slate-500 font-medium">{member.role}</span>
                                    <span className={`text-xs font-bold ${member.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {member.trend > 0 ? '+' : ''}{member.trend}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Charts Section - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Deals Funnel */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-900 text-base">Pipeline Stage</h3>
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <ChevronDown className="w-5 h-5" />
                    </button>
                </div>
                <div className="space-y-5">
                    {data.dealsByStage.map((stage, i) => {
                            const maxVal = Math.max(...data.dealsByStage.map(d => d.value));
                            const width = maxVal > 0 ? (stage.value / maxVal) * 100 : 0;
                            return (
                            <div key={stage.name} className="group">
                                <div className="flex justify-between text-sm font-medium mb-1.5">
                                    <span className="text-slate-500 group-hover:text-indigo-600 transition-colors">{stage.name}</span>
                                    <span className="text-slate-900">{formatCurrency(stage.value)}</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                                            i === 0 ? 'bg-indigo-400' : 
                                            i === 1 ? 'bg-indigo-500' : 
                                            i === 2 ? 'bg-indigo-600' : 
                                            i === 3 ? 'bg-violet-600' : 'bg-emerald-500'
                                        }`} 
                                        style={{ width: `${width}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 skew-x-12 -ml-4 w-2"></div>
                                    </div>
                                </div>
                            </div>
                            );
                    })}
                </div>
            </div>

            {/* Revenue Bar Chart */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-slate-900 text-base">Revenue Forecast</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        <span className="text-xs text-slate-500 font-medium">Actual</span>
                        <span className="w-2 h-2 rounded-full bg-indigo-200 ml-2"></span>
                        <span className="text-xs text-slate-500 font-medium">Proj</span>
                    </div>
                </div>
                <div className="flex items-end justify-between h-48 px-2">
                    {data.revenueByMonth.map((m) => {
                        const maxRev = Math.max(...data.revenueByMonth.map(r => r.value));
                        const height = maxRev > 0 ? (m.value / maxRev) * 100 : 0;
                        const isProjected = ['Nov', 'Dec'].includes(m.month);
                        return (
                            <div key={m.month} className="flex flex-col items-center gap-3 w-full group relative">
                                <div className="relative w-full flex justify-center h-full items-end">
                                    <div 
                                        className={`w-3 sm:w-5 rounded-t-lg transition-all duration-1000 ease-elastic ${isProjected ? 'bg-indigo-200' : 'bg-indigo-600'} group-hover:opacity-90`} 
                                        style={{ height: `${height}%` }}
                                    ></div>
                                </div>
                                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide group-hover:text-indigo-600 transition-colors">{m.month}</span>
                                
                                {/* Float tooltip */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                    {(m.value/1000).toFixed(0)}k
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Recent Feed */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="font-bold text-slate-900 text-lg">Activity Feed</h3>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">See All</button>
            </div>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                {data.recentActivities.map((act, i) => (
                    <div key={act.id} className={`p-4 flex gap-4 hover:bg-slate-50 active:bg-slate-100 transition-colors items-center ${i !== data.recentActivities.length - 1 ? 'border-b border-slate-50' : ''}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                            act.type === 'CALL' ? 'bg-blue-50 text-blue-600' :
                            act.type === 'MEETING' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                            {act.type === 'CALL' ? <Phone className="w-5 h-5" /> : 
                             act.type === 'MEETING' ? <Users className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[15px] font-semibold text-slate-900 truncate">{act.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">{new Date(act.dueAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • <span className="capitalize">{act.type.toLowerCase()}</span></p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                             <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

const FilterChip: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`px-5 py-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-300 active:scale-95 ${
            active 
            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 ring-1 ring-slate-900' 
            : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
        }`}
    >
        {label}
    </button>
);

const StatCard: React.FC<{ icon: any, label: string, value: string, trend: string, color: string, bg: string }> = ({ icon: Icon, label, value, trend, color, bg }) => {
    const isPositive = trend.startsWith('+');
    return (
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-36 active:scale-[0.98] transition-all hover:shadow-md hover:border-indigo-100">
            <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {trend}
                </div>
            </div>
            <div>
                <span className="text-[13px] text-slate-500 font-medium block mb-1">{label}</span>
                <h4 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{value}</h4>
            </div>
        </div>
    );
};

export default Dashboard;