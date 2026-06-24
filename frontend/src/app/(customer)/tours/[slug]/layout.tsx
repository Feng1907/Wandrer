import type { Metadata } from 'next';
import Script from 'next/script';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wandrer.vn';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface TourData {
  title: string;
  description: string;
  highlights: string;
  images: { url: string; isPrimary: boolean }[];
  basePrice: number;
  duration: number;
  category: string;
  slug: string;
}

async function fetchTour(slug: string): Promise<TourData | null> {
  try {
    const res = await fetch(`${API_URL}/tours/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json() as Promise<TourData>;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tour = await fetchTour(slug);
  if (!tour) return { title: 'Tour không tồn tại' };

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
}

export default async function TourLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await fetchTour(slug);

  const jsonLd = tour
    ? {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: tour.title,
        description: tour.description,
        url: `${BASE_URL}/tours/${tour.slug}`,
        image: tour.images?.map((img) => img.url) ?? [],
        touristType: tour.category,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'VND',
          price: tour.basePrice,
          availability: 'https://schema.org/InStock',
          url: `${BASE_URL}/tours/${tour.slug}`,
        },
        provider: {
          '@type': 'TravelAgency',
          name: 'Wandrer',
          url: BASE_URL,
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <Script
          id="tour-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
