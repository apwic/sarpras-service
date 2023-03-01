const Joi = require('joi');
const UserService = require('../services/user-service');
const handleRequest = require('../utils/handle-request');
const JWTMiddleware = require('../middlewares/jwt');
const buildResponse = require('../utils/build-response');
const UserValidation = require('../middlewares/user-validation');
const expressValidation = require('express-validation').validate;

const roleRouter = require('express').Router();

module.exports = () => {
    roleRouter.get('/',
        [JWTMiddleware.verifyToken, UserValidation.superUser],

    );

    roleRouter.put('/grant',
        [JWTMiddleware.verifyToken, UserValidation.superUser],
        expressValidation({
            body: Joi.object({
                user_id: Joi.string().required(),
                role: Joi.string().required(),
            }),
        }),
        handleRequest(async (req) => UserService.updateUserRole(req.body.user_id, req.body.role)),
        buildResponse()
    );
}