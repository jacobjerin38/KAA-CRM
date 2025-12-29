import React, { useState } from 'react';
import { Contact, LeadAnalysis } from '../types';
import { analyzeLead, draftEmail } from '../services/geminiService';
import { Search, Mail, Phone, Calendar, Loader2, Sparkles, ArrowLeft, MoreHorizontal, ChevronRight, MessageSquare, X, RefreshCw } from 'lucide-react';

const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Sarah Connor', role: 'CTO', company: 'Skynet Inc', email: 'sarah@skynet.com', status: 'Active', lastContact: '2 days ago', notes: 'Interested in AI security. Skeptical about current implementation timeline. Needs assurance on compliance.', avatarColor: 'bg-indigo-100 text-indigo-600' },
  { id: '2', name: 'James Holden', role: 'Director', company: 'Tycho Mfg', email: 'j.holden@tycho.com', status: 'Lead', lastContact: '1 week ago', notes: 'Looking to optimize logistics. Budget approval pending board meeting next Tuesday. Very enthusiastic.', avatarColor: 'bg-emerald-100 text-emerald-600' },
  { id: '3', name: 'Ellen Ripley', role: 'Safety', company: 'Weyland', email: 'ripley@weyland.com', status: 'Churned', lastContact: '1 month ago', notes: 'Unhappy with safety protocols. Mentioned competitors offering better risk assessment tools.', avatarColor: 'bg-amber-100 text-amber-600' },
  { id: '4', name: 'Rick Deckard', role: 'Detective', company: 'Blade Runner', email: 'rick@lapd.gov', status: 'Active', lastContact: 'Yesterday', notes: 'Investigating replicant issues. Needs advanced tracking software.', avatarColor: 'bg-slate-100 text-slate-600' },
  { id: '5', name: 'Leia Organa', role: 'General', company: 'Rebellion', email: 'leia@rebellion.org', status: 'Lead', lastContact: '3 days ago', notes: 'Needs secure comms channel immediately.', avatarColor: 'bg-rose-100 text-rose-600' },
];

const ContactsView: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [analysis, setAnalysis] = useState<LeadAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSelect = async (contact: Contact) => {
      setSelectedContact(contact);
      setAnalysis(null);
      setGeneratedEmail("");
  };

  const handleBack = () => {
      setSelectedContact(null);
  };

  const handleRefresh = () => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 1000);
  };

  const runAnalysis = async () => {
      if (!selectedContact) return;
      setAnalyzing(true);
      const result = await analyzeLead(selectedContact.notes, selectedContact.company);
      setAnalysis(result);
      setAnalyzing(false);
  };

  const runDraftEmail = async () => {
      if (!selectedContact) return;
      setDrafting(true);
      const text = await draftEmail(selectedContact.name, "Following up on our last conversation");
      setGeneratedEmail(text);
      setDrafting(false);
  };

  // Detailed "Sheet" View
  if (selectedContact) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 animate-slide-up">
            {/* Draggable Handle Visual */}
            <div className="h-6 w-full flex items-center justify-center pt-2 bg-slate-50">
                <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
            </div>

            {/* Header Actions */}
            <div className="px-6 pb-2 flex items-center justify-between">
                <button onClick={handleBack} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all">
                    <X className="w-6 h-6 text-slate-500" />
                </button>
                <div className="flex gap-2">
                     <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all">
                        <MoreHorizontal className="w-6 h-6 text-slate-500" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar">
                 {/* Large Profile Header */}
                 <div className="flex flex-col items-center text-center mt-2 mb-8 animate-fade-in-up">
                    <div className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold mb-5 ${selectedContact.avatarColor} ring-4 ring-white shadow-xl shadow-slate-200`}>
                        {selectedContact.name.charAt(0)}
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedContact.name}</h1>
                    <p className="text-slate-500 font-medium mt-1">{selectedContact.role} <span className="text-slate-300 mx-1">•</span> {selectedContact.company}</p>
                    
                    {/* Native Action Grid */}
                    <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-xs">
                        <ActionButton icon={Phone} label="Call" color="bg-green-50 text-green-600" />
                        <ActionButton icon={MessageSquare} label="Message" color="bg-blue-50 text-blue-600" />
                        <ActionButton icon={Mail} label="Email" color="bg-indigo-50 text-indigo-600" />
                    </div>
                 </div>

                 {/* AI Intelligence Section */}
                 <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Gemini Actions</h3>
                    <div className="bg-white rounded-[1.5rem] p-1 shadow-sm border border-slate-100">
                        <div className="grid grid-cols-2 divide-x divide-slate-100">
                             <button 
                                onClick={runAnalysis}
                                disabled={analyzing}
                                className="p-4 flex flex-col items-center gap-2 hover:bg-slate-50 rounded-l-[1.2rem] transition-colors active:bg-slate-100"
                            >
                                {analyzing ? <Loader2 className="w-6 h-6 animate-spin text-purple-600" /> : <Sparkles className="w-6 h-6 text-purple-600" />}
                                <span className="text-xs font-bold text-slate-700">Analyze Lead</span>
                            </button>
                             <button 
                                onClick={runDraftEmail}
                                disabled={drafting}
                                className="p-4 flex flex-col items-center gap-2 hover:bg-slate-50 rounded-r-[1.2rem] transition-colors active:bg-slate-100"
                            >
                                 {drafting ? <Loader2 className="w-6 h-6 animate-spin text-indigo-600" /> : <Mail className="w-6 h-6 text-indigo-600" />}
                                <span className="text-xs font-bold text-slate-700">Draft Email</span>
                            </button>
                        </div>

                        {/* Analysis Result */}
                        {(analysis || generatedEmail) && (
                            <div className="border-t border-slate-100 p-5 bg-slate-50/50 rounded-b-[1.2rem]">
                                {analysis && (
                                    <div className="space-y-3 animate-fade-in-up">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500 uppercase">Score</span>
                                            <span className="text-xl font-bold text-slate-900">{analysis.score}/100</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-600 rounded-full" style={{ width: `${analysis.score}%` }}></div>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">{analysis.reasoning}</p>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold">
                                            Suggestion: {analysis.suggestedAction}
                                        </div>
                                    </div>
                                )}
                                {generatedEmail && (
                                    <div className="mt-4 animate-fade-in-up">
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-700 font-mono shadow-sm">
                                            {generatedEmail}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                 </div>

                 {/* Notes Section */}
                 <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">History</h3>
                    <div className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                <Calendar className="w-4 h-4 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-[15px] text-slate-900 leading-relaxed">{selectedContact.notes}</p>
                                <p className="text-xs text-slate-400 mt-2 font-medium">Last interaction: {selectedContact.lastContact}</p>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
      );
  }

  // Master List View
  return (
    <div className="flex flex-col h-full bg-slate-50 pb-24 overflow-y-auto smooth-scroll">
       {/* Collapsible Header */}
       <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200/50 px-5 pt-safe-top pb-3 transition-all">
            <div className="flex items-center justify-between mt-2 mb-3">
                <h1 className="text-[32px] font-bold text-slate-900 tracking-tight">People</h1>
                <button 
                    onClick={handleRefresh}
                    className={`w-10 h-10 rounded-full bg-white/50 border border-slate-200 flex items-center justify-center active:scale-95 transition-all ${isRefreshing ? 'text-indigo-600' : 'text-slate-500'}`}
                >
                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>
            
            {/* Native Search Bar */}
            <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search name, company..." 
                    className="w-full bg-slate-200/60 border-none rounded-xl py-2.5 pl-9 pr-4 text-[15px] font-medium text-slate-900 placeholder-slate-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                />
            </div>
       </div>

       <div className={`p-5 space-y-3 transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
            {MOCK_CONTACTS.map((contact, idx) => (
                <div 
                    key={contact.id}
                    onClick={() => handleSelect(contact)}
                    className="bg-white p-4 rounded-[1.2rem] border border-slate-100 shadow-sm active:scale-[0.98] active:bg-slate-50 transition-all flex items-center gap-4 group animate-fade-in-up"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${contact.avatarColor} relative`}>
                        {contact.name.charAt(0)}
                        {/* Status Dot */}
                        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${
                             contact.status === 'Active' ? 'bg-green-500' :
                             contact.status === 'Lead' ? 'bg-blue-500' : 'bg-slate-300'
                        }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                            <h3 className="font-bold text-slate-900 truncate text-[16px]">{contact.name}</h3>
                            <span className="text-xs text-slate-400 font-medium">{contact.lastContact}</span>
                        </div>
                        <p className="text-[13px] text-slate-500 truncate font-medium">{contact.role} at {contact.company}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </div>
            ))}
       </div>
    </div>
  );
};

const ActionButton: React.FC<{ icon: any, label: string, color: string }> = ({ icon: Icon, label, color }) => (
    <button className={`flex flex-col items-center gap-2 group active:scale-95 transition-transform`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <span className="text-xs font-semibold text-slate-600">{label}</span>
    </button>
);

export default ContactsView;