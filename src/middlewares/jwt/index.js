const jwt = require('jsonwebtoken');
const UserRepository = require('../../repositories/user-repository');
const StandardError = require('../../utils/standard-error');
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
		let bearerHeader = req.headers['authorization'];

		if (!bearerHeader) {
			const err = generateErrorUnauthorized(req);
			return res.status(401).json(err);
		}

		const bearer = bearerHeader.split(' ');
		const token = bearer[1];
		let user_id;

		jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
			if (err) {
				const err = generateErrorUnauthorized(req);
				return res.status(401).json(err);
			}

			user_id = decoded.user_id;
		});

		const user = await UserRepository.getUserById(user_id);
		if (!user) {
			const err = generateErrorUnauthorized(req);
			return res.status(401).json(err);
		}

		req.user = {
			id: user.id,
			role: user.role,
		}

		next();
	}

	static createToken(user_id) {
		return jwt.sign({ user_id }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRE });
	}
}

module.exports = JWTMiddleware;
