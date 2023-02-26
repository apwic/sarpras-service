const Joi = require('joi');
const handleRequest = require('../utils/handle-request');
const expressValidation = require('express-validation').validate;

const loginRouter = require('express').Router();

module.exports = () => {
    loginRouter.get('/INA',
        expressValidation({
            query: Joi.object({
                ticket: Joi.string().optional(),
            }),
        }),
        handleRequest()
    )

    return loginRouter;
};
