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

	rootRouter.post('/', handleRequest((req, res) => {
		const user = UserRepository.createUser({
			email: 'gdryrp@gmail.com',
			role: 'SUPER_USEadaR',
			name: 'GEDE ARYA',
			nim_nip: 'asdadaadadsdad',
			token: '1234567890',
			no_telp: '1234567890',
		});

		return user;
	}),
	buildResponse(),
	);

	return rootRouter;
};
