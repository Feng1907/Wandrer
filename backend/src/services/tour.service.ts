import slugify from 'slugify';
import prisma from '../utils/prisma';
import { uploadImage, deleteImage } from '../utils/cloudinary';
import { TourCategory, TourStatus, Prisma } from '@prisma/client';

export interface CreateTourDto {
  title: string;
  description: string;
  highlights: string;
  includes: string;
  excludes: string;
  cancelPolicy: string;
  basePrice: number;
  childPrice: number;
  duration: number;
  maxCapacity: number;
  category: TourCategory;
  featured?: boolean;
}

export interface TourQuery {
  page?: number;
  limit?: number;
  category?: TourCategory;
  status?: TourStatus;
  search?: string;
  featured?: boolean;
}

const buildSlug = async (title: string, excludeId?: string) => {
  let slug = slugify(title, { lower: true, strict: true, locale: 'vi' });
  const existing = await prisma.tour.findFirst({
    where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
  });
  if (existing) slug = `${slug}-${Date.now()}`;
  return slug;
};

export const createTour = async (dto: CreateTourDto) => {
  const slug = await buildSlug(dto.title);
  return prisma.tour.create({
    data: {
      ...dto,
      slug,
      basePrice: new Prisma.Decimal(dto.basePrice),
      childPrice: new Prisma.Decimal(dto.childPrice),
    },
    include: { images: true },
  });
};

export const updateTour = async (id: string, dto: Partial<CreateTourDto>) => {
  const existing = await prisma.tour.findUnique({ where: { id } });
  if (!existing) throw new Error('Tour không tồn tại');

  const slug = dto.title ? await buildSlug(dto.title, id) : undefined;

  return prisma.tour.update({
    where: { id },
    data: {
      ...dto,
      ...(slug ? { slug } : {}),
      ...(dto.basePrice !== undefined ? { basePrice: new Prisma.Decimal(dto.basePrice) } : {}),
      ...(dto.childPrice !== undefined ? { childPrice: new Prisma.Decimal(dto.childPrice) } : {}),
    },
    include: { images: true, itineraries: { orderBy: { day: 'asc' } } },
  });
};

export const deleteTour = async (id: string) => {
  const tour = await prisma.tour.findUnique({ where: { id }, include: { images: true } });
  if (!tour) throw new Error('Tour không tồn tại');

  await Promise.all(tour.images.map((img) => deleteImage(img.publicId)));
  await prisma.tour.delete({ where: { id } });
};

export const getTours = async (query: TourQuery) => {
  const { page = 1, limit = 10, category, status, search, featured } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.TourWhereInput = {
    ...(category ? { category } : {}),
    ...(status ? { status } : {}),
    ...(featured !== undefined ? { featured } : {}),
    ...(search
      ? { title: { contains: search } }
      : {}),
  };

  const [tours, total] = await Promise.all([
    prisma.tour.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { images: { where: { isPrimary: true }, take: 1 } },
    }),
    prisma.tour.count({ where }),
  ]);

  return { tours, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getTourById = async (id: string) => {
  const tour = await prisma.tour.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      itineraries: { orderBy: { day: 'asc' } },
      departures: { where: { isActive: true }, orderBy: { departureDate: 'asc' } },
      reviews: {
        where: { isVisible: true },
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });
  if (!tour) throw new Error('Tour không tồn tại');
  return tour;
};

export const addTourImages = async (
  tourId: string,
  files: Express.Multer.File[],
  setPrimaryIndex = 0,
) => {
  const tour = await prisma.tour.findUnique({ where: { id: tourId } });
  if (!tour) throw new Error('Tour không tồn tại');

  const hasExisting = await prisma.tourImage.count({ where: { tourId } });

  const uploads = await Promise.all(files.map((f) => uploadImage(f.path)));

  const images = await Promise.all(
    uploads.map((u, i) =>
      prisma.tourImage.create({
        data: {
          tourId,
          url: u.url,
          publicId: u.publicId,
          isPrimary: hasExisting === 0 && i === setPrimaryIndex,
          order: hasExisting + i,
        },
      }),
    ),
  );
  return images;
};

export const deleteTourImage = async (imageId: string) => {
  const img = await prisma.tourImage.findUnique({ where: { id: imageId } });
  if (!img) throw new Error('Ảnh không tồn tại');
  await deleteImage(img.publicId);
  await prisma.tourImage.delete({ where: { id: imageId } });
};

export const setPrimaryImage = async (imageId: string, tourId: string) => {
  await prisma.tourImage.updateMany({ where: { tourId }, data: { isPrimary: false } });
  return prisma.tourImage.update({ where: { id: imageId }, data: { isPrimary: true } });
};
