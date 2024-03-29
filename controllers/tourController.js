import Tour from '../models/tourModel.js';
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));


const getAllTours = async(req, res) => {
  try{
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    })
  }catch(err){
    res.status(404).json({
      status: 'failed',
      message: err
    })
  }
  
};

const getSpecificTour = async(req, res) => {
  try{
    const specificTour = await Tour.findById(req.params.id)
    
    res.status(200).json({
      status: 'success',
      data: {
        tour: specificTour
      }
    })  
  }catch(err){
    res.status(400).json({
      status: 'failed',
      message: err
    })
  }
  
};

const createTour = async(req, res) => {

  try{
    const newTour = await Tour.create(req.body)

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      })
  }catch(err){
    res.status(400).json({
      status: 'failed',
      message: err
    })
  }  
};

const updateTour = async(req, res) => {
  try{
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    res.status(201).json({
      status: 'success',
      data: {
        tour: tour
      }
    })
  }catch(err){
    res.status(400).json({
      status: 'failed',
      message: err
    })
  }
};

const deleteTour = async(req, res) => {
  try{
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null,
      });
  }catch(err){
    res.status(400).json({
      status: 'failed',
      message: err
    })
  }

  
};

export {getAllTours, getSpecificTour , createTour , updateTour, deleteTour} 