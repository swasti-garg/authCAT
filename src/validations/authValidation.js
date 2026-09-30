const Joi = require("joi");

const signupSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(8)
        .required(),
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .required(),
});
const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
});
const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),

    password: Joi.string()
        .min(8)
        .required(),
});
module.exports = {
    signupSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,

};