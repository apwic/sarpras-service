const Joi = require('joi');
const JWTMiddleware = require('../middlewares/jwt');
const UserRepository = require('../repositories/user-repository');
const buildResponse = require('../utils/build-response');
const handleRequest = require('../utils/handle-request');

const rootRouter = require('express').Router();

module.exports = () => {
	rootRouter.get('/', (req, res) => {
		const token = JWTMiddleware.createToken(3)
		res.json({
			message: token,
		});
	});

	return rootRouter;
};
