const mongoose = require('mongoose')
const movieSchema =  new mongoose.Schema({
    adminId : String,
    movieName: String ,
    price : Number,
    type : String,
    description : String,
    rating : String,
    movieImage : String,
    categoryId:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'typeCategoryData'
    }
})

const movieModel =  mongoose.model ("movies", movieSchema);

module.exports = movieModel;



