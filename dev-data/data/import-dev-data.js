import fs from "fs"
import mongoose from "mongoose"
import dotenv from "dotenv"
import Tour from "../../models/tourModel.js"
dotenv.config({path: './config.env'})

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD )

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() =>console.log("DB connections successfull!!"))

// Reading Json File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8'));

// Import Data Into DB
const importData = async ()=>{
    try{
        await Tour.create(tours)
        console.log('Data successfully loaded!')
    }catch(err){
        console.log(err)
    }
}

// Delete ALl Data From DB
const deleteData = async()=>{
    try{
        await Tour.deleteMany()
        console.log('Data successfully deleted!')
        process.exit();
    }catch(err){
        console.log(err)
    }
}

if(process.argv[2] === '--import'){
    importData();
}
else if(process.argv[2] === '--delete'){
    deleteData();
}

console.log(process.argv)