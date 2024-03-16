const mongoose = require('mongoose')
const review = new mongoose.Schema({
    body:String,
    rating:Number
})
module.exports = mongoose.model('review',review);