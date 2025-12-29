import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { Image as ImageIcon, Sparkles, Download, Loader2, AlertCircle, Wand2 } from 'lucide-react';

const VisionView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setImageUri(null);

    try {
      const response = await generateImage(prompt);
      let foundImage = false;
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
          for (const part of parts) {
            if (part.inlineData) {
                setImageUri(`data:image/png;base64,${part.inlineData.data}`);
                foundImage = true;
                break;
            }
          }
      }
      if (!foundImage) setError("Model returned text only.");
    } catch (e) {
      console.error(e);
      setError("Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 pb-20 overflow-hidden relative">
       {/* Ambient Background */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] opacity-50"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] opacity-40"></div>
       </div>

       {/* Header */}
       <div className="relative z-10 px-6 py-6 pt-safe-top flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                    Vision <span className="text-purple-400">.AI</span>
                </h2>
                <p className="text-slate-400 text-sm font-medium">Generative Studio</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-purple-300" />
            </div>
       </div>

       <div className="flex-1 flex flex-col px-4 pb-4 space-y-4 relative z-10">
        {/* Main Display Area */}
        <div className="flex-1 bg-slate-900/40 backdrop-blur-sm rounded-[2rem] border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl group">
            {loading && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md z-10 animate-fade-in-up">
                    <div className="relative">
                        <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                        <Loader2 className="w-12 h-12 text-purple-400 animate-spin relative z-10" />
                    </div>
                    <div className="text-purple-200 text-xs font-bold tracking-[0.2em] mt-6 animate-pulse">RENDERING SCENE...</div>
                 </div>
            )}
            
            {imageUri ? (
                <>
                    <img src={imageUri} alt="Generated" className="w-full h-full object-cover animate-fade-in-up" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <a 
                        href={imageUri} 
                        download="nexus-vision.png"
                        className="absolute bottom-6 right-6 p-4 bg-white text-slate-900 rounded-full shadow-lg shadow-black/50 hover:scale-110 transition-transform active:scale-95"
                    >
                        <Download className="w-6 h-6" />
                    </a>
                </>
            ) : error ? (
                <div className="text-red-400 flex flex-col items-center gap-3 animate-fade-in-up">
                    <AlertCircle className="w-10 h-10 opacity-50" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            ) : (
                <div className="text-slate-600 flex flex-col items-center gap-4 animate-pulse-slow">
                    <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50 border-dashed">
                        <ImageIcon className="w-10 h-10 opacity-30" />
                    </div>
                    <span className="text-xs font-bold tracking-widest opacity-40">ENTER PROMPT BELOW</span>
                </div>
            )}
        </div>

        {/* Floating Glass Input */}
        <div className="absolute bottom-6 left-4 right-4 bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-[1.8rem] shadow-2xl flex flex-col gap-2">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your imagination..."
                className="w-full bg-transparent border-none rounded-xl px-4 py-2 text-white placeholder-slate-400 focus:ring-0 outline-none text-[15px] resize-none"
                rows={2}
            />
            <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                    loading 
                    ? 'bg-slate-800 text-slate-500' 
                    : 'bg-white text-slate-900 hover:bg-purple-50 active:scale-[0.98]'
                }`}
            >
                <Sparkles className="w-4 h-4 text-purple-600" />
                {loading ? 'Processing...' : 'Generate Art'}
            </button>
        </div>
       </div>
    </div>
  );
};

export default VisionView;