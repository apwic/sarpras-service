const UserRepository = require('../../repositories/user-repository');
const { userRoles } = require('./constant');

class UserService {
	static async getUserById(id) {
		const user = await UserRepository.getUserById(id);

		return {
			message: 'Fetching user successful',
			data: user,
		};
	}

	static async createUser(user) {
		const createdUser = await UserRepository.createUser(user);

		return {
			message: `Create user with id ${createdUser.id} successful`,
		};
	}

  static async updateUser(id, email, no_telp) {
    await UserRepository.updateUser(id, email, no_telp);

    return {
      message: `Update user with id ${id} successful`,
    }
  }

	static async updateUserRole(userId, role) {
		await UserRepository.changeRole(userId, role);

		return {
			message: `Update user role with role ${role} successful`,
		};
	}

	static async getUserRoles() {
		return {
			message: 'Fetching users role successful',
			data: {
				booking_staff: await UserRepository.getUserByRole(userRoles.BOOKING_STAFF),
				super_user: await UserRepository.getUserByRole(userRoles.SUPER_USER),
				sanitation_staff: await UserRepository.getUserByRole(userRoles.SANITATION_STAFF),
				defect_staff: await UserRepository.getUserByRole(userRoles.DEFECT_STAFF),
				safety_staff: await UserRepository.getUserByRole(userRoles.SAFETY_STAFF),
				loss_staff: await UserRepository.getUserByRole(userRoles.LOSS_STAFF),
			},
		};
	}

	static async getUserRolesUnassigned() {
		const users = await UserRepository.getUserByRole(userRoles.BASIC_USER);

		return {
			message: 'Fetching unassigned users successful',
			data: users,
		};
	}
}

module.exports = UserService;
