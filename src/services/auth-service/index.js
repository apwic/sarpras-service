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

		let userDetails = await UserRepository.getUserByNip(itbUserDetails.nim_nip);
		if (userDetails === null) {
			userDetails = await catchThrows(UserRepository.createUser(itbUserDetails));
			if (isPromiseError(userDetails)) {
				const redirectPath = `${SARPRAS_BASE_URL}/login?status=failed`;
				return redirectPath;
			}
		}

		const token = JWTMiddleware.createToken(userDetails.id);

		const redirectPath = `${SARPRAS_BASE_URL}/login?status=success&token=${token}`;
		return redirectPath;
	}

	static async TestLogin() {
		const itbUserDetails = {
			nim_nip: '12345sdfsfd67890',
			name: 'Arip Dandi Arkanando',
			email: 'arip@gmail.com',
			role: 'SUPER_USER',
			token: '1234567890',
			no_telp: '1234567890',
			unit: '1234567890',
			image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUfiJE2Hg3o-qmmkm8t3rk5s0uxS3VnVpIai54dZKF_w&s'
		};

		const user = await UserRepository.createUser(itbUserDetails);

		const token = JWTMiddleware.createToken(user.id);

		return {
			token
		}
	}
}

module.exports = AuthService;
