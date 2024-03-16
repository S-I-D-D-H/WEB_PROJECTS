const mongoose = require('mongoose');
const mon = mongoose.Schema;
const review_1 = require('./review')
const campgroundSchema = new mon(
    {
        title:String,
        image:String,
        price:Number,
        description:String,
        location:String,
        review:[{type:mon.Types.ObjectId,ref:'review'}]
    }
);

campgroundSchema.post('findOneAndDelete', async function(data)
{
   if(data)
   {
        await review_1.deleteMany({_id: {$in:data.review}}) 
   }
})


module.exports = mongoose.model('campground',campgroundSchema)

