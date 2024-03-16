const express=require('express')
const app=express();
const path = require('path');
const campground = require('./models/campground')
const {place,descriptors}=require('./seeds/seedhelper')
const methodoverride = require('method-override')
const catchasync = require('./utils/CatchAsync')
const expresserror = require('./utils/ExpressError')
const review = require('./models/review')
const{reviewSchema}=('./schema')
const joi = require('joi');
app.use(methodoverride('_method'));

const engine = require('ejs-mate');
app.engine('ejs',engine)

app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))

const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
mongoose.connect('mongodb://127.0.0.1:27017/camp')
  .then(() => console.log('Connected!'))
  .catch(err=>
    {
        console.log("ERROE!!! " + err);
    })

app.get('/',(req,res)=>
{
    res.render('home')
})

app.get('/campground',catchasync(async (req,res)=>
{
    // res.render('home')
    const capm = await campground.find({});
    res.render('campground/index', {capm})
}))

app.get('/campground/new', (req,res)=>
{
    // res.render('home')
    // const capm = await campground.findById(req.params.id);
    res.render('campground/new')
})

app.post('/campground', catchasync(async(req,res,next)=>
{
    const schema = joi.object({
        campground:joi.object({
            title:joi.string().required(),
            price:joi.number().required().min(10),
            location:joi.string().required(),
            image:joi.string().required(),
            description:joi.string().required()
            }   
        )
    }).required()
    const {error} = schema.validate(req.body);
    if(error)
    {
        throw new expresserror(error.details.map(el=>el.message),400)
    }
    const capm = new campground(req.body.campground);
    await capm.save();
    res.redirect('/campground')
}))

app.get('/campground/:id',catchasync(async (req,res)=>
{
    // res.render('home')
    const capm = await campground.findById(req.params.id).populate('review');
    res.render('campground/show', {capm})
}))

app.get('/campground/:id/edit',catchasync(async (req,res)=>
{
    // res.render('home')
    const capm = await campground.findById(req.params.id);
    res.render('campground/edit', {capm})
}))

app.put('/campground/:id',catchasync(async (req,res,next)=>
{
  
    const capm = await campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
    res.redirect(`/campground/${capm._id}`)
}))

app.delete('/campground/:id', catchasync(async(req,res)=>
{
    const capm = await campground.findByIdAndDelete(req.params.id)
    res.redirect('/campground')
}))
// review
// const validatereview = (req,res,next)=>{
//     const {error} = reviewSchema.validate(req.body)
//     if(error)
//     {
//         throw new expresserror(error.details.map(el=>el.message),400)
//     }
//     else
//     {
//         next();
//     }
// }
app.post('/campground/:id/review', catchasync(async (req,res)=>
{
    console.log(req.body);
    const schema = joi.object({
        review : joi.object({
            body:joi.string().required(),
            rating:joi.number().required()
        })
    }).required()
    const {error} = schema.validate(req.body)
    if(error)
    {
        throw new expresserror(error.details.map(el=>el.message),400)
    }
    const capm = await campground.findById(req.params.id);
    const rev = new review(req.body.review);
    capm.review.push(rev);
    await rev.save()
    await capm.save()
    res.redirect(`/campground/${capm._id}`)

}))
app.delete('/campground/:id/review/:revid',catchasync(async(req,res)=>{

    const a = await campground.findById(req.params.id)
    const c = await campground.findByIdAndUpdate(req.params.id,{$pull:{review:req.params.revid}})
    // const c1 = await c.review.findByIdAndDelete(req.params.revid)
    const r = await review.findByIdAndDelete(req.params.revid)
    // await r.save()
    // await c.save()
    res.redirect(`/campground/${a._id}`)
}))
app.all('*',(req,res,next)=>
{
    next(new expresserror('page not found',404))
})
app.use((err,req,res,next)=>
{
    const {statuscode = 500, message="something went wrong"} = err;
    res.status(statuscode).render('error',{ err });
})
app.listen(3000,()=>
{
    console.log("CONNECTED!!!")
})
