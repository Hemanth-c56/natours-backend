import express from 'express';
import {createTour , deleteTour , getAllTours , getSpecificTour , updateTour} from './../controllers/tourController.js';

const router = express.Router();

// router.param('id', checkID)

router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getSpecificTour)
  .patch(updateTour)
  .delete(deleteTour);

export default router;
