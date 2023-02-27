const UserRepository = require('../../repositories/user-repository');

class UserService {
	static async getUserById(id) {
		return await UserRepository.getUserById(id);
	}

	static async createUser(user) {
		return await UserRepository.createUser(user);
	}
}

module.exports = UserService;
