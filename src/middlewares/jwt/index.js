const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;

class JWTMiddleware {
	static verifyToken(req, res, next) {
		let bearerHeader = req.headers['authorization'];

		if (!bearerHeader) {
			return res.status(403).send({
				message: 'Token not provided!',
			});
		}

		const bearer = bearerHeader.split(' ');
		const token = bearer[1];

		jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
			if (err) {
				return res.status(401).send({
					message: 'Unauthorized token!',
				});
			}
			req.user_id = decoded.user_id;
			next();
		});
	}

	static createToken(user_id) {
		return jwt.sign({ user_id }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRE });
	}
}

module.exports = JWTMiddleware;
