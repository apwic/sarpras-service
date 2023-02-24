const UserRepository = require('../../repositories/user-repository');

class UserService {
    constructor() {}

    async getUserById(id) {
        return await UserRepository.getUserById(id);
    }

    async createUser(user) {
        return await UserRepository.createUser(user);
    }
}