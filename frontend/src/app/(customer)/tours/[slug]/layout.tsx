import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wandrer.vn';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_URL}/tours/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return { title: 'Tour không tồn tại' };

    const tour = await res.json() as {
      title: string;
      description: string;
      highlights: string;
      images: { url: string; isPrimary: boolean }[];
      basePrice: number;
    };

    const primaryImage = tour.images?.find((img) => img.isPrimary) ?? tour.images?.[0];

    return {
      title: tour.title,
      description: `${tour.description.slice(0, 155)}...`,
      openGraph: {
        title: tour.title,
        description: tour.highlights?.slice(0, 200),
        type: 'website',
        url: `${BASE_URL}/tours/${slug}`,
        images: primaryImage ? [{ url: primaryImage.url, width: 1200, height: 630, alt: tour.title }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: tour.title,
        description: tour.highlights?.slice(0, 200),
        images: primaryImage ? [primaryImage.url] : [],
      },
    };
  } catch {
    return { title: 'Tour Du Lịch — Wandrer' };
  }
}

export default function TourLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
