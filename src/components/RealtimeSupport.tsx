import React, { useState, useRef, useEffect } from 'react';
import { SupportChatMessage, ActiveTab, UserMembership } from '../types';
import { 
  Headphones, 
  Send, 
  ShieldCheck, 
  User, 
  PhoneCall, 
  Clock, 
  ArrowRight, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface RealtimeSupportProps {
  messages: SupportChatMessage[];
  onSendMessage: (text: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserMembership;
}

export const RealtimeSupport: React.FC<RealtimeSupportProps> = ({
  messages,
  onSendMessage,
  setActiveTab,
  user,
}) => {
  const [inputText, setInputText] = useState('');
  const [callNoticeActive, setCallNoticeActive] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    soundFx.playChime('tick');
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const quickPrompts = [
    { label: 'Book consultation & shuttle pickup', text: 'How do I book an in-person clinic consultation with patient medical shuttle pickup?' },
    { label: 'Check remaining consultation quota', text: 'How many doctor consultations do I have remaining under my annual subscription?' },
    { label: 'Fasting instructions for tomorrow', text: 'What are the fasting rules for my upcoming health checkup tomorrow?' },
    { label: 'Urgent medication refill', text: 'I need an urgent delivery refill for my Albuterol inhaler.' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              24/7 Registered Nurse Triage Desk
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">Live Support Active</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Real-Time Care Concierge & Clinical Triage
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Direct real-time communication with your assigned clinical team for appointment prep, emergency guidance, prescription navigation, and symptom triage.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              soundFx.playChime('alert');
              setCallNoticeActive(true);
              setTimeout(() => setCallNoticeActive(false), 5000);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>Priority Care Line (24/7)</span>
          </button>
        </div>
      </div>

      {/* Simulated Hotline Connect Notice */}
      {callNoticeActive && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>
              <strong>Connecting to ❤️ Home Health 24/7 Priority Clinical Line:</strong> 1-800-555-HEART (Heart Home Health Network)
            </span>
          </div>
          <button 
            onClick={() => setCallNoticeActive(false)}
            className="text-emerald-700 hover:text-emerald-900 font-bold px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[560px]">
        {/* Chat Header Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-sm">
                EV
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Nurse Elena Vance, BSN, RN</span>
                <span className="text-[10px] font-medium text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded">
                  Personal Care Concierge
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                ❤️ Home Health Clinical Navigation Desk · Heart Home Health · Average reply &lt; 90s
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Active Desk Coverage</span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                    RN
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className={`flex items-center gap-2 text-[11px] text-slate-400 ${isUser ? 'justify-end' : ''}`}>
                    <span className="font-semibold text-slate-700">{msg.senderName}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {msg.actionTag && (
                      <div className="mt-3 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => setActiveTab(msg.actionTag!.tab)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <span>{msg.actionTag.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Triage Prompts */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 pl-1">
            Quick Ask:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundFx.playChime('tick');
                onSendMessage(p.text);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap transition-colors shrink-0 text-xs"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message to Nurse Elena (e.g. checkup prep, urgent refill, symptoms)..."
            className="flex-1 text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors shadow-xs shrink-0 flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
