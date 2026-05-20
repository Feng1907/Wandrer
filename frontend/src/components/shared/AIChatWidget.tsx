'use client';

import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { Bot, ChevronDown, Send, Sparkles, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import api from '@/lib/axios';

type Recommendation = {
  tourId: string;
  title: string;
  slug: string;
  basePrice: number;
  duration: number;
  category: string;
  primaryImage: string | null;
  reason: string;
  matchScore: number;
};

type RecommendResponse = {
  aiSummary: string;
  recommendations: Recommendation[];
};

type ChatMessage = {
  id: number;
  role: 'assistant' | 'user';
  text: string;
  recommendations?: Recommendation[];
};

const SUGGESTIONS = [
  'tour xem world cup',
  'tour thái lan',
  'tour hàn quốc',
  'gặp nhân viên tư vấn',
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      text: 'Hi, Mình là Tripi - Gõ đúng chất!',
    },
  ]);

  const sendMessage = async (value = input) => {
    const prompt = value.trim();
    if (!prompt || loading) return;

    setInput('');
    setLoading(true);
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: 'user', text: prompt },
    ]);

    try {
      const { data } = await api.post<RecommendResponse>('/ai/recommend', { prompt });
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: data.aiSummary || 'Mình đã tìm được một vài gợi ý phù hợp cho bạn.',
          recommendations: data.recommendations,
        },
      ]);
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: message || 'Mình chưa xử lý được yêu cầu này. Bạn thử mô tả lại ngắn gọn hơn nhé.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-3 rounded-full bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-2xl transition-colors hover:bg-blue-700"
        aria-label="Mở chat AI"
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-600">
          <Bot className="h-5 w-5" />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </span>
        Chat AI
      </button>
    );
  }

  return (
    <section className="fixed bottom-5 left-5 z-50 flex h-[min(680px,calc(100vh-40px))] w-[min(500px,calc(100vw-40px))] flex-col overflow-hidden border border-neutral-200 bg-white shadow-2xl">
      <div className="flex h-16 shrink-0 items-center gap-3 bg-blue-700 px-5 text-white">
        <button
          onClick={() => setOpen(false)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          aria-label="Thu nhỏ chat"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-600">
          <Bot className="h-6 w-6" />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        <div className="min-w-0">
          <p className="font-bold leading-tight">Tripi</p>
          <p className="text-xs text-blue-100">Trợ lý du lịch Wandrer</p>
        </div>
        <Sparkles className="ml-auto h-5 w-5 text-amber-300" />
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral-50 px-4 py-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[86%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'border border-neutral-100 bg-white text-neutral-900'
                  }`}
                >
                  {message.text}
                </div>
                {message.role === 'assistant' && (
                  <div className="mt-2 flex items-center gap-4 px-2 text-neutral-600">
                    <ThumbsUp className="h-4 w-4" />
                    <ThumbsDown className="h-4 w-4" />
                    <span className="text-[11px] text-neutral-400">
                      {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
                {!!message.recommendations?.length && (
                  <div className="mt-3 space-y-2 text-left">
                    {message.recommendations.map((tour) => (
                      <Link
                        key={tour.tourId}
                        href={`/tours/${tour.slug}`}
                        className="block rounded-xl border border-neutral-100 bg-white p-3 text-sm shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-semibold text-neutral-900">{tour.title}</p>
                          <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                            {tour.matchScore}/10
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-neutral-500">{tour.reason}</p>
                        <p className="mt-2 text-xs font-semibold text-blue-700">
                          {tour.duration} ngày · {formatPrice(tour.basePrice)}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="inline-flex rounded-2xl border border-neutral-100 bg-white px-4 py-3 text-sm text-neutral-500 shadow-sm">
              Tripi đang tìm gợi ý...
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-neutral-200 bg-white">
        <button
          onClick={() => setSuggestionsOpen(!suggestionsOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-neutral-500"
        >
          Gợi ý câu hỏi
          <ChevronDown className={`h-4 w-4 transition-transform ${suggestionsOpen ? 'rotate-180' : ''}`} />
        </button>
        {suggestionsOpen && (
          <div className="flex flex-wrap gap-2 px-4 pb-3">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => sendMessage(suggestion)}
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
          className="flex gap-3 border-t border-neutral-100 px-4 py-4"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type a message..."
            className="min-w-0 flex-1 border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-blue-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Gửi tin nhắn"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </section>
  );
}
