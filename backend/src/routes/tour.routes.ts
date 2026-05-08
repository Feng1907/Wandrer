import { Router } from 'express';
import * as tourCtrl from '../controllers/tour.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Public
router.get('/', tourCtrl.getTours);
router.get('/:id', tourCtrl.getTourById);
router.get('/:id/departures', tourCtrl.getDepartures);

// Admin / Staff only
router.use(authenticate, authorize('ADMIN', 'STAFF'));

router.post('/', tourCtrl.createTour);
router.patch('/:id', tourCtrl.updateTour);
router.delete('/:id', authorize('ADMIN'), tourCtrl.deleteTour);

// Images
router.post('/:id/images', upload.array('images', 10), tourCtrl.uploadImages);
router.delete('/:id/images/:imageId', tourCtrl.deleteImage);
router.patch('/:id/images/:imageId/primary', tourCtrl.setPrimaryImage);

// Itineraries
router.put('/:id/itineraries', tourCtrl.upsertItineraries);

// Departures
router.post('/:id/departures', tourCtrl.createDeparture);
router.patch('/:id/departures/:departureId', tourCtrl.updateDeparture);
router.delete('/:id/departures/:departureId', tourCtrl.deleteDeparture);

export default router;
