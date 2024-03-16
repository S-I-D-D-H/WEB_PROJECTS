const joi = require('joi');

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

const reviewSchema = joi.object({
    review:joi.object({
        rating:joi.number().required(),
        body:joi.string().required()
    })
}).required()