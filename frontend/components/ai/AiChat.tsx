'use client';

import React, { useState } from 'react';
import { ChatMessage } from '@/types/ai';
import { aiService } from '@/services/ai.service';
import { Button } from '@/components/ui/Button';
import { Send, Bot, User, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const QUICK_PROMPTS = [
  'Create an Instagram caption for a new car launch',
  'Generate 10 TikTok video ideas for an agency',
  'Write a high-converting Facebook ad caption',
  'Create a punchy YouTube Shorts title and hook',
  'Make this caption sound more professional',
];

export function AiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      content:
        'Hello! I am your SocialHub AI Marketing Copilot. I can draft viral hooks, format omnichannel captions, generate hashtags, and curate content calendars. How can I help you today?',
      timestamp: '10:00 AM',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const response = await aiService.sendChatMessage(trimmed);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl flex flex-col h-[650px] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              AI Marketing Copilot
            </h3>
            <p className="text-[11px] text-slate-400">Marketing tuned model • Instant assistance</p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          Ready
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[88%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs'
                  : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 rounded-tl-xs whitespace-pre-line'
              }`}
            >
              {msg.content}

              {msg.sender === 'assistant' && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.content)}
                      className="hover:text-purple-600 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <Link
                      href="/create"
                      className="hover:text-blue-600 flex items-center gap-0.5 font-medium"
                    >
                      <span>Use in Post</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 items-center text-xs text-slate-400">
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200" />
            </div>
          </div>
        )}
      </div>

      {/* Preset Prompts */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none flex items-center gap-1.5 bg-slate-50/50 dark:bg-slate-900/50">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider shrink-0 font-bold">
          Quick:
        </span>
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputVal);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask AI Copilot to draft a campaign, hook, or calendar..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button
            type="submit"
            size="md"
            disabled={!inputVal.trim() || isTyping}
            className="bg-purple-600 hover:bg-purple-700 text-white shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
