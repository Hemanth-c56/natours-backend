import Tour from '../models/tourModel.js';
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const getAllTours = async (req, res) => {
  try {
    // 1A) FILTERING
    // const queryObj = req.query;      //queryObj is actually a reference to the real req.query object
    const queryObj = {...req.query}      //qeuryObh is actually a copy of the real req.query object
    const excludedFields = ['page','sort','limit','fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) ADVANCE FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}` )

    let query = Tour.find(JSON.parse(queryStr));

    // 2) SORTING
    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }
    else{
      query = query.sort('-createdAt')
    }

    // 3) FIELD LIMITING
    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }
    else{
      query = query.select('-__v') // we are excluding only __v field to get to client from database
    }

    // 4) PAGINATION
    query = query.skip(2).limit(10)

    //Execute Query
    const tours = await query;

    //Send Response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

const getSpecificTour = async (req, res) => {
  try {
    const specificTour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour: specificTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(201).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

export { getAllTours, getSpecificTour, createTour, updateTour, deleteTour };
