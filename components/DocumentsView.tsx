import React from 'react';
import { MOCK_DOCUMENTS } from '../services/mockData';
import { FileText, Download, UploadCloud, Search, Folder, MoreVertical, File } from 'lucide-react';

const DocumentsView: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-safe-top pb-4 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200/50 z-20">
            <div className="flex items-center justify-between mt-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Documents</h1>
                <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600">
                    <Search className="w-5 h-5" />
                </button>
            </div>
            {/* Upload Area */}
            <div className="mt-4 p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-center group">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500">Tap to upload files</span>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Folders */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Folders</h3>
                <div className="grid grid-cols-2 gap-4">
                    {['Contracts', 'Invoices', 'Proposals', 'Assets'].map((folder) => (
                        <div key={folder} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 hover:bg-slate-50 cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                <Folder className="w-5 h-5 fill-current" />
                            </div>
                            <span className="font-bold text-slate-700 text-sm">{folder}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Files */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Files</h3>
                <div className="space-y-3">
                    {MOCK_DOCUMENTS.map((doc) => (
                        <div key={doc.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow group">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                doc.type === 'PDF' ? 'bg-red-50 text-red-600' : 
                                doc.type === 'DOC' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h4>
                                <p className="text-xs text-slate-400 mt-0.5">{doc.size} • {doc.uploadedAt.toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-1">
                                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 transition-colors">
                                    <Download className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default DocumentsView;