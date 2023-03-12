const Joi = require('joi');
const expressValidation = require('express-validation').validate;

const handleRequest = require('../utils/handle-request');
const buildResponse = require('../utils/build-response');

const JWTMiddleware = require('../middlewares/jwt');
const UserService = require('../services/user-service');
const { uploadSingleFile } = require('../middlewares/file');

const profileRouter = require('express').Router();

module.exports = () => {
	profileRouter.get(
		'/',
		[JWTMiddleware.verifyToken],
		handleRequest(async (req) => UserService.getUserById(req.user.id)),
		buildResponse()
	);

	profileRouter.put(
		'/edit',
		[JWTMiddleware.verifyToken, uploadSingleFile],
		handleRequest(async (req) =>
			UserService.updateUser(req.user.id, req.file, req.body.no_telp)
		),
		buildResponse()
	);

	return profileRouter;
};
