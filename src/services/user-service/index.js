const UserRepository = require('../../repositories/user-repository');
const { userRoles } = require('./constant');

class UserService {
	static async getUserById(id) {
		const user = await UserRepository.getUserById(id);

    return {
      message: "Fetching user successful",
      data: user
    }
	}

	static async createUser(user) {
		const created_user = await UserRepository.createUser(user);

    return {
      message: `Create user with id ${created_user.id} successful`
    }
	}

	static async updateUserRole(userId, role) {
		const user = await UserRepository.changeRole(userId, role);

    return {
      message: `Update user role with role ${role} successful`
    }
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
      }
		}
	}
}

module.exports = UserService;
