const Joi = require('joi');
const expressValidation = require('express-validation').validate;

const handleRequest = require('../utils/handle-request');

const AuthService = require('../services/auth-service');

const loginRouter = require('express').Router();

module.exports = () => {
	loginRouter.get(
		'/INA',
		expressValidation({
			query: Joi.object({
				ticket: Joi.string().optional(),
			}),
		}),
		handleRequest(async (req) => await AuthService.SSOlogin(req.query.ticket)),
		(_, res) => {
			res.redirect(res.locals.response_data);
		}
	);

	return loginRouter;
};
