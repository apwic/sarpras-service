const Joi = require('joi');
const expressValidation = require('express-validation').validate;

const handleRequest = require('../utils/handle-request');
const buildResponse = require('../utils/build-response');

const JWTMiddleware = require('../middlewares/jwt');
const UserValidation = require('../middlewares/user-validation');
const UserService = require('../services/user-service');

const roleRouter = require('express').Router();

module.exports = () => {
    roleRouter.get('/',
        [JWTMiddleware.verifyToken, UserValidation.superUser],
        handleRequest(async () => await UserService.getUseRoles()),
        buildResponse()
    );

    roleRouter.put('/grant',
        [JWTMiddleware.verifyToken, UserValidation.superUser],
        expressValidation({
            body: Joi.object({
                user_id: Joi.string().required(),
                role: Joi.string().required(),
            }),
        }),
        handleRequest(async (req) => await UserService.updateUserRole(req.body.user_id, req.body.role)),
        buildResponse()
    );
}