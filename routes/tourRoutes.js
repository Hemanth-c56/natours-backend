import express from 'express';
import {createTour , deleteTour , getAllTours , getSpecificTour , updateTour, aliasTopTours} from './../controllers/tourController.js';

const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours ,getAllTours)

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
