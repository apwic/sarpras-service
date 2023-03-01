const UserRepository = require('../../repositories/user-repository');

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
}

module.exports = UserService;
