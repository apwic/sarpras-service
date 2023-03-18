const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const handleRequest = require('../utils/handle-request');

const AuthService = require('../services/auth-service');
const buildResponse = require('../utils/build-response');

const loginRouter = require('express').Router();

module.exports = () => {
    loginRouter.get(
        '/INA',
        validator.query(
            Joi.object({
                ticket: Joi.string().optional(),
            }),
        ),
        handleRequest(
            async (req) => await AuthService.SSOlogin(req.query.ticket),
        ),
        (_, res) => {
            res.redirect(res.locals.response_data);
        },
    );

    loginRouter.get(
        '/test',
        handleRequest(
            async (req) => await AuthService.TestLogin(req.query.ticket),
        ),
        buildResponse(),
    );

    return loginRouter;
};
