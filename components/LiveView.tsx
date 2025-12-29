import React, { useEffect, useRef, useState } from 'react';
import { Modality, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, Activity, Radio } from 'lucide-react';
import { getGeminiClient } from '../services/geminiService';
import { LIVE_MODEL } from '../types';
import { createPCMBlob, decodeAudioData } from '../services/audioUtils';

const LiveView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0); // For visualizer

  // Audio Contexts
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  
  // Streaming Nodes
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  
  // Playback Queue
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Connection
  const sessionRef = useRef<Promise<any> | null>(null);

  const cleanup = () => {
    setIsActive(false);
    
    // Stop all playing audio
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;

    // Disconnect MediaStream
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    
    // Disconnect Input Nodes
    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
    }
    if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
    }
    
    // Close Audio Contexts
    if (inputContextRef.current?.state !== 'closed') inputContextRef.current?.close();
    if (outputContextRef.current?.state !== 'closed') outputContextRef.current?.close();

    // Close Session (Not explicitly possible via API, but we drop the ref)
    sessionRef.current = null;
  };

  const startSession = async () => {
    setError(null);
    try {
      // 1. Setup Audio Contexts
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputNodeRef.current = outputContextRef.current.createGain();
      outputNodeRef.current.connect(outputContextRef.current.destination);

      // 2. Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 3. Connect to Live API
      const ai = getGeminiClient();
      sessionRef.current = ai.live.connect({
        model: LIVE_MODEL,
        callbacks: {
          onopen: () => {
            console.log('Live Session Opened');
            setIsActive(true);
            
            // Start processing audio input
            if (!inputContextRef.current || !streamRef.current) return;
            
            const source = inputContextRef.current.createMediaStreamSource(streamRef.current);
            sourceRef.current = source;
            
            const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              // Calculate volume for visualizer
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / inputData.length);
              setVolume(Math.min(rms * 5, 1)); // Scale for visual

              const pcmBlob = createPCMBlob(inputData);
              sessionRef.current?.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputContextRef.current.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (!outputContextRef.current || !outputNodeRef.current) return;

            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
                // Ensure context is running (mobile browsers require user gesture interaction)
                if (outputContextRef.current.state === 'suspended') {
                   await outputContextRef.current.resume();
                }

                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputContextRef.current.currentTime);
                
                const audioBuffer = await decodeAudioData(
                    base64ToUint8Array(audioData), // Use helper, not decode() global
                    outputContextRef.current
                );

                const source = outputContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNodeRef.current);
                
                source.onended = () => sourcesRef.current.delete(source);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
            }

            if (msg.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            console.log("Live Session Closed");
            cleanup();
          },
          onerror: (err) => {
            console.error("Live Session Error", err);
            setError("Connection failed. Please check permissions and try again.");
            cleanup();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        }
      });
      
    } catch (e) {
      console.error(e);
      setError("Failed to access microphone.");
      cleanup();
    }
  };

  // Helper for converting Base64 to Uint8Array used in onmessage
  function base64ToUint8Array(base64: string): Uint8Array {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
  }

  useEffect(() => {
    return () => cleanup();
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-nexus-900 relative overflow-hidden">
      {/* Background ambient effects */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-20'}`}>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-nexus-accent/20 rounded-full blur-[100px] animate-pulse"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      </div>

      <div className="z-10 flex flex-col items-center space-y-12 w-full max-w-md">
        <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Live Link</h2>
            <p className="text-slate-400">Real-time voice interface</p>
        </div>

        {/* Visualizer / Status Ring */}
        <div className="relative">
            {/* Ripples */}
            {isActive && (
                <>
                    <div className="absolute inset-0 rounded-full border border-nexus-accent/30 scale-125 animate-ping opacity-20"></div>
                    <div className="absolute inset-0 rounded-full border border-purple-500/30 scale-150 animate-ping opacity-10 delay-300"></div>
                </>
            )}
            
            <button
                onClick={isActive ? cleanup : startSession}
                className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.5)] ${
                    isActive 
                    ? 'bg-red-500/90 hover:bg-red-600 border-4 border-red-400/30' 
                    : 'bg-nexus-accent hover:bg-blue-600 border-4 border-blue-400/30'
                }`}
                style={{
                    transform: isActive ? `scale(${1 + volume * 0.5})` : 'scale(1)'
                }}
            >
                {isActive ? <MicOff className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
            </button>
        </div>

        {/* Status Text */}
        <div className="h-12 flex flex-col items-center justify-center">
            {error ? (
                <span className="text-red-400 text-sm bg-red-900/20 px-4 py-2 rounded-full border border-red-500/20">{error}</span>
            ) : isActive ? (
                <div className="flex items-center space-x-2 text-nexus-glow">
                    <Activity className="w-4 h-4 animate-bounce" />
                    <span className="tracking-widest text-sm font-mono uppercase">Listening...</span>
                </div>
            ) : (
                <div className="flex items-center space-x-2 text-slate-500">
                    <Radio className="w-4 h-4" />
                    <span className="text-sm">Tap to Connect</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LiveView;
