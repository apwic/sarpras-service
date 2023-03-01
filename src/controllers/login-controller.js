const Joi = require('joi');
const AuthService = require('../services/auth-service');
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
		handleRequest(async (req) => AuthService.SSOlogin(req.query.ticket)),
		(_, res) => {
			res.redirect(res.locals.response_data);
		}
	);

	return loginRouter;
};
