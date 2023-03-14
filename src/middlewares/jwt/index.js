const jwt = require('jsonwebtoken');
const UserRepository = require('../../repositories/user-repository');
const StandardError = require('../../utils/standard-error');
const { LogHelper } = require('../../utils/log-helper');
const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;

function generateErrorUnauthorized(req) {
	return new StandardError(
		401,
		'Unauthorized',
		'You are not authorized to access this resource',
		{},
		{
			req_body: req.body,
			req_ip: req.ip,
			req_params: req.params,
			req_query: req.query,
		}
	);
}

class JWTMiddleware {
	static async verifyToken(req, res, next) {
		try {
			let bearerHeader = req.headers['authorization'];

			if (!bearerHeader) {
				const err = generateErrorUnauthorized(req);
				LogHelper.error(err.message);
				return res.status(401).send(err);
			}

			const bearer = bearerHeader.split(' ');
			const token = bearer[1];
			let user_id;

			jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
				if (err) {
					err = generateErrorUnauthorized(req);
					LogHelper.error(err.message);
					return res.status(401).send(err);
				}

				user_id = decoded.user_id;
			});

			const user = await UserRepository.getUserById(user_id);
			if (!user) {
				err = generateErrorUnauthorized(req);
				LogHelper.error(err.message);
				return res.status(401).send(err);
			}

			req.user = {
				id: user.id,
				role: user.role,
			};

			next();
		} catch (e) {
			LogHelper.error(e.message);
		}
	}

	static createToken(user_id) {
		return jwt.sign({ user_id: user_id }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRE });
	}
}

module.exports = JWTMiddleware;
