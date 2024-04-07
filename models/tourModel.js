import mongoose from "mongoose"

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    duration:{
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description:{
        type: String,
        trim: true
    },
    imageCover:{
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date]
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

tourSchema.virtual('durationWeeks').get(function(){ //cannot access this durationWeeks by query or simply by tours.find(durationWeeks : 1) because this is not in the databse , it is just a virtual element thats usefull and reduces the memory usage
    return this.duration / 7;                      
})

const Tour = mongoose.model('Tour', tourSchema)

export default Tour