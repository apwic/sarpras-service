const SSOServiceClient = require('../../clients/sso-service-client');
const JWTMiddleware = require('../../middlewares/jwt');
const UserRepository = require('../../repositories/user-repository');
const { catchThrows, isPromiseError } = require('../../utils/promise');

const { SARPRAS_BASE_URL } = process.env;

class AuthService {
	static async SSOlogin(ticket) {
		const itbUserDetails = await catchThrows(SSOServiceClient.getITBUserDetails(ticket));
		if (isPromiseError(itbUserDetails)) {
			const redirectPath = `${SARPRAS_BASE_URL}/login?status=failed`;
			return redirectPath;
		}

		let userDetails = await UserRepository.getUserByNip(itbUserDetails.nip);
		if (userDetails === null) {
			userDetails = await catchThrows(UserRepository.createUser(itbUserDetails));
			if (isPromiseError(itbUserDetails)) {
				const redirectPath = `${SARPRAS_BASE_URL}/login?status=failed`;
				return redirectPath;
			}
		}

		const token = JWTMiddleware.createToken(userDetails.id);

		const redirectPath = `${SARPRAS_BASE_URL}/login?status=success&token=${token}`;
		return redirectPath;
	}
}

module.exports = AuthService;
