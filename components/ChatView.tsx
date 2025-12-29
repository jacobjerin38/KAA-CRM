import React, { useState, useRef, useEffect } from 'react';
import { getGeminiClient } from '../services/geminiService';
import { ChatMessage, CRM_MODEL } from '../types';
import { Send, Bot, User, Loader2, Sparkles, Plus, Image as ImageIcon } from 'lucide-react';
import { GenerateContentResponse, Chat } from '@google/genai';

const SUGGESTED_PROMPTS = [
    "Draft a follow-up for Sarah",
    "Summarize my deals",
    "Find leads in Tech",
    "Schedule a meeting"
];

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: "Hello! I'm your KAA assistant. How can I help close some deals today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use a ref for the chat session but initialize it in useEffect
  const chatSessionRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Chat Session safely
  useEffect(() => {
    try {
        const ai = getGeminiClient();
        chatSessionRef.current = ai.chats.create({
            model: CRM_MODEL,
            config: { 
                systemInstruction: "You are KAA CRM Assistant. Be concise, professional, and mobile-friendly." 
            }
        });
    } catch (e) {
        console.error("Failed to initialize chat session", e);
    }
  }, []);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: new Date(),
        isThinking: true
    }]);

    try {
      if (!chatSessionRef.current) {
          throw new Error("Chat session not initialized");
      }
      
      const result = await chatSessionRef.current.sendMessageStream({ message: text });
      let fullText = '';
      
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
            fullText += c.text;
            setMessages(prev => prev.map(msg => 
                msg.id === modelMsgId ? { ...msg, text: fullText, isThinking: false } : msg
            ));
            scrollToBottom();
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId 
        ? { ...msg, text: "I'm having trouble connecting right now. Please check your API Key configuration.", isThinking: false } 
        : msg
      ));
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
        {/* Glass Header */}
        <div className="absolute top-0 w-full bg-white/80 backdrop-blur-xl z-20 px-6 pt-safe-top pb-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4 fill-white" />
                </div>
                Assistant
            </h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full border border-green-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-green-700 uppercase">Online</span>
            </div>
        </div>

      <div className="flex-1 overflow-y-auto px-4 pt-28 pb-40 space-y-6 no-scrollbar bg-slate-50">
        {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                    {!isUser && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white border border-slate-200 shadow-sm mb-1">
                            <Bot className="w-5 h-5 text-indigo-600" />
                        </div>
                    )}
                    
                    <div className={`px-5 py-3 text-[15px] leading-relaxed shadow-sm relative
                        ${isUser 
                            ? 'bg-indigo-600 text-white rounded-[20px] rounded-br-none' 
                            : 'bg-white text-slate-800 rounded-[20px] rounded-bl-none border border-slate-100'
                        }`}>
                        {msg.isThinking && !msg.text ? (
                            <div className="flex space-x-1.5 h-6 items-center px-1">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        ) : (
                            msg.text
                        )}
                    </div>
                </div>
              </div>
            );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area with Suggested Prompts */}
      <div className="absolute bottom-[80px] left-0 w-full z-20">
        {/* Horizontal Chips */}
        {messages.length < 5 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-3 mask-image-fade">
                {SUGGESTED_PROMPTS.map((prompt) => (
                    <button 
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-full text-xs font-semibold text-slate-600 shadow-sm whitespace-nowrap hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors active:scale-95"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        )}

        {/* Floating Input Bar */}
        <div className="px-3 pb-3">
            <div className="flex items-end gap-2 bg-white/80 backdrop-blur-xl rounded-[1.5rem] p-2 pr-2 shadow-[0_-5px_30px_rgba(0,0,0,0.05)] border border-slate-100 ring-1 ring-slate-200/50">
                <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 active:scale-95 transition-all mb-0.5">
                    <Plus className="w-5 h-5" />
                </button>
                <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-[15px] pl-2 py-3 max-h-32 resize-none"
                    rows={1}
                    disabled={isStreaming}
                />
                <button 
                    onClick={() => handleSend()}
                    disabled={isStreaming || !input.trim()}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 mb-0.5 ${
                        input.trim() 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-100 active:scale-90' 
                        : 'bg-slate-100 text-slate-300 scale-95'
                    }`}
                >
                    {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;