import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    MONGODB_URI: Joi.string().required(),
    JWT_SECRET: Joi.string().min(10).required(),
    PORT: Joi.number().required(),
    FRONTEND_URL: Joi.string().required(),
});
