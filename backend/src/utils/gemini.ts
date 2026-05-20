import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  console.warn('[Gemini] GEMINI_API_KEY chưa được cấu hình — tính năng AI sẽ không hoạt động');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

// gemini-2.0-flash: nhanh, rẻ, đủ dùng cho recommendation
export const getGeminiModel = () => genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
