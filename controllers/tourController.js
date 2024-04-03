import Tour from '../models/tourModel.js';
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const aliasTopTours = (req,res,next)=>{
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price',
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next();
}

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
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1)*limit;

    // page=3&limit=10 , 1-10 ---> page - 1 , 11-20 ---> page - 2, 21-30 ---> page - 3
    query = query.skip(skip).limit(limit)

    if(req.query.page){
      const numTours = await Tour.countDocuments();
      if(skip >= numTours) throw new Error('This page does not exist')
    }

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

export { getAllTours, getSpecificTour, createTour, updateTour, deleteTour, aliasTopTours };
