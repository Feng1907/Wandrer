import { Request, Response } from 'express';
import * as tourService from '../services/tour.service';
import * as itineraryService from '../services/itinerary.service';
import * as departureService from '../services/departure.service';
import { TourCategory, TourStatus } from '@prisma/client';

export const createTour = async (req: Request, res: Response) => {
  try {
    const tour = await tourService.createTour(req.body);
    res.status(201).json(tour);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTour = async (req: Request, res: Response) => {
  try {
    const tour = await tourService.updateTour(req.params.id, req.body);
    res.json(tour);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTour = async (req: Request, res: Response) => {
  try {
    await tourService.deleteTour(req.params.id);
    res.json({ message: 'Xóa tour thành công' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getTours = async (req: Request, res: Response) => {
  try {
    const { page, limit, category, status, search, featured } = req.query;
    const result = await tourService.getTours({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      category: category as TourCategory | undefined,
      status: status as TourStatus | undefined,
      search: search as string | undefined,
      featured: featured !== undefined ? featured === 'true' : undefined,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getTourById = async (req: Request, res: Response) => {
  try {
    const tour = await tourService.getTourById(req.params.id);
    res.json(tour);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const uploadImages = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ message: 'Không có file nào được upload' });
      return;
    }
    const images = await tourService.addTourImages(req.params.id, files);
    res.status(201).json(images);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    await tourService.deleteTourImage(req.params.imageId);
    res.json({ message: 'Xóa ảnh thành công' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const setPrimaryImage = async (req: Request, res: Response) => {
  try {
    const image = await tourService.setPrimaryImage(req.params.imageId, req.params.id);
    res.json(image);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const upsertItineraries = async (req: Request, res: Response) => {
  try {
    await itineraryService.upsertItineraries(req.params.id, req.body);
    const itineraries = await itineraryService.getItineraries(req.params.id);
    res.json(itineraries);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const createDeparture = async (req: Request, res: Response) => {
  try {
    const departure = await departureService.createDeparture({ ...req.body, tourId: req.params.id });
    res.status(201).json(departure);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateDeparture = async (req: Request, res: Response) => {
  try {
    const departure = await departureService.updateDeparture(req.params.departureId, req.body);
    res.json(departure);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteDeparture = async (req: Request, res: Response) => {
  try {
    await departureService.deleteDeparture(req.params.departureId);
    res.json({ message: 'Xóa lịch khởi hành thành công' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getDepartures = async (req: Request, res: Response) => {
  try {
    const departures = await departureService.getDeparturesByTour(req.params.id);
    res.json(departures);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
