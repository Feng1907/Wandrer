import prisma from '../utils/prisma';
import { getGeminiModel } from '../utils/gemini';

export interface TourRecommendation {
  tourId: string;
  title: string;
  slug: string;
  basePrice: number;
  duration: number;
  category: string;
  primaryImage: string | null;
  reason: string;
  matchScore: number;
}

interface RecommendResult {
  recommendations: TourRecommendation[];
  aiSummary: string;
}

// Lấy danh sách tour active (tối đa 40 tour) để đưa vào context cho AI
const getActiveTourContext = async () => {
  const tours = await prisma.tour.findMany({
    where: { status: 'ACTIVE' },
    take: 40,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      highlights: true,
      basePrice: true,
      childPrice: true,
      duration: true,
      category: true,
      maxCapacity: true,
      images: { where: { isPrimary: true }, take: 1, select: { url: true } },
      departures: {
        where: { isActive: true, availableSlots: { gt: 0 } },
        orderBy: { departureDate: 'asc' },
        take: 1,
        select: { departureDate: true, availableSlots: true },
      },
    },
  });

  return tours.map((t) => ({
    id: t.id,
    title: t.title,
    slug: t.slug,
    description: t.description.slice(0, 200),
    highlights: t.highlights.slice(0, 150),
    basePrice: t.basePrice,
    childPrice: t.childPrice,
    duration: t.duration,
    category: t.category,
    primaryImage: t.images[0]?.url ?? null,
    nextDeparture: t.departures[0]?.departureDate ?? null,
    availableSlots: t.departures[0]?.availableSlots ?? 0,
  }));
};

const buildPrompt = (userPrompt: string, tours: Awaited<ReturnType<typeof getActiveTourContext>>) => {
  const tourJson = JSON.stringify(tours, null, 0);

  return `Bạn là trợ lý AI của nền tảng du lịch Wandrer. Nhiệm vụ: phân tích yêu cầu người dùng và gợi ý tối đa 4 tour phù hợp nhất từ danh sách có sẵn.

YÊU CẦU NGƯỜI DÙNG:
"${userPrompt}"

DANH SÁCH TOUR HIỆN CÓ (JSON):
${tourJson}

HƯỚNG DẪN:
- Chỉ gợi ý tour có trong danh sách trên (dùng đúng id, title, slug).
- Phân tích: ngân sách (basePrice), thời gian (duration tính theo ngày), loại hình (category), chỗ còn trống.
- matchScore: 1–10, điểm càng cao càng phù hợp.
- reason: 1–2 câu tiếng Việt giải thích tại sao tour này phù hợp.
- aiSummary: 1–2 câu tóm tắt cách bạn hiểu yêu cầu và tiêu chí lọc đã áp dụng.

TRẢ VỀ JSON THUẦN (không có markdown, không có \`\`\`):
{
  "aiSummary": "...",
  "recommendations": [
    {
      "tourId": "...",
      "title": "...",
      "slug": "...",
      "basePrice": 0,
      "duration": 0,
      "category": "...",
      "primaryImage": "...",
      "reason": "...",
      "matchScore": 9
    }
  ]
}`;
};

export const recommendTours = async (userPrompt: string): Promise<RecommendResult> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Tính năng AI chưa được kích hoạt. Vui lòng cấu hình GEMINI_API_KEY.');
  }

  const tours = await getActiveTourContext();

  if (tours.length === 0) {
    return {
      recommendations: [],
      aiSummary: 'Hiện chưa có tour nào đang mở bán.',
    };
  }

  const model = getGeminiModel();
  const prompt = buildPrompt(userPrompt, tours);

  const result = await model.generateContent(prompt);
  const rawText = result.response.text().trim();

  // Strip markdown code fences nếu model trả về có bọc
  const jsonText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  let parsed: RecommendResult;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error('AI trả về định dạng không hợp lệ. Vui lòng thử lại.');
  }

  if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
    throw new Error('AI không tìm được tour phù hợp. Hãy thử mô tả chi tiết hơn.');
  }

  // Enrich với primaryImage từ DB (AI có thể trả null)
  const tourMap = new Map(tours.map((t) => [t.id, t]));
  parsed.recommendations = parsed.recommendations
    .filter((r) => tourMap.has(r.tourId))
    .map((r) => ({
      ...r,
      primaryImage: r.primaryImage ?? tourMap.get(r.tourId)?.primaryImage ?? null,
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  return parsed;
};
