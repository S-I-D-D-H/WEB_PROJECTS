const campground = require('../models/campground')
const cities = require('./cities');

const mongoose = require('mongoose');
const { descriptors,places } = require('./seedhelper');
mongoose.connect('mongodb://127.0.0.1:27017/camp')
  .then(() => console.log('Connected!'))
  .catch(err=>
    {
        console.log("ERROE!!! " + err);
    })

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async()=>
{
  console.log("HI");
  await campground.deleteMany({});
  for(let i=0; i<50; i++)
  {
    const rand = Math.floor(Math.random()*1000);
    const price = Math.floor(Math.random()*600);
    const camp = new campground({
        location:`${cities[rand].city}, ${cities[rand].state}`,
        title:`${sample(descriptors)} ${sample(places)}`,
        image:'https://source.unsplash.com/collection/483251',
        description:'INTO THE WOODS',
        price
      }
    )
    await camp.save();
  }
}
seedDB().then(
  ()=>{ mongoose.connection.close()}
);