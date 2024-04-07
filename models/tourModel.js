import mongoose from "mongoose"
import slugify from "slugify"

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    slug: String,
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
    startDates: [Date],
    secretTour:{
        type: Boolean,
        default: false
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

tourSchema.virtual('durationWeeks').get(function(){ //cannot access this durationWeeks by query or simply by tours.find(durationWeeks : 1) because this is not in the databse , it is just a virtual element thats usefull and reduces the memory usage
    return this.duration / 7;                      
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create() command but not on .insertMany() and all
tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true}) //this. is the currect document
    // console.log(this.slug)
    next();
})
// ------------------- more examples of mongoose middle ware ----------------------
// tourSchema.pre('save', function(next){
//     console.log('Will save document...');
//     next();
// })

// tourSchema.post('save', function(doc, next){ 
//     console.log(doc)  //doc is the saved document
//     next();
// })
//-----------------------------------------------------------------------------------

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next){  //this will work for all the queries that starts with find :- find, findOne, findMany, findById ....
    this.find({secretTour: {$ne: true}})  //this points to the query

    this.start = Date.now();
    next();
})

tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took ${Date.now() - this.start} milliseconds`)
    console.log(docs);
    next();
})


//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({$match: {secretTour: {$ne: true}}})
    console.log(this.pipeline())
    next();
})

const Tour = mongoose.model('Tour', tourSchema)

export default Tour