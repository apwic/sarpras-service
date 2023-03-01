const Joi = require('joi');
const UserService = require('../services/user-service');
const handleRequest = require('../utils/handle-request');
const JWTMiddleware = require('../middlewares/jwt');
const buildResponse = require('../utils/build-response');
const expressValidation = require('express-validation').validate;

const profileRouter = require('express').Router();

module.exports = () => {
	profileRouter.get('/',
		[JWTMiddleware.verifyToken],
		handleRequest(async (req) => UserService.getUserById(req.user.id)),
		buildResponse()
	);

	return profileRouter;
};
