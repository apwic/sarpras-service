const UserRepository = require('../../repositories/user-repository');
const { userRoles } = require('./constant');

class UserService {
	static async getUserById(id) {
		return await UserRepository.getUserById(id);
	}

	static async createUser(user) {
		return await UserRepository.createUser(user);
	}

	static async updateUserRole(userId, role) {
		return await UserRepository.changeRole(userId, role);
	}

	static async getUserRoles() {
		return {
			booking_staff: await UserRepository.getUserByRole(userRoles.BOOKING_STAFF),
			super_user: await UserRepository.getUserByRole(userRoles.SUPER_USER),
			sanitation_staff: await UserRepository.getUserByRole(userRoles.SANITATION_STAFF),
			defect_staff: await UserRepository.getUserByRole(userRoles.DEFECT_STAFF),
			safety_staff: await UserRepository.getUserByRole(userRoles.SAFETY_STAFF),
			loss_staff: await UserRepository.getUserByRole(userRoles.LOSS_STAFF),
		}
	}
}

module.exports = UserService;
