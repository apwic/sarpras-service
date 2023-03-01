const { sequelize, models } = require('../db/index');
const StandardError = require('../utils/standard-error');

class UserRepository {
	static async getUserById(id) {
		try {
			return await models.User.findOne({
				where: {
					id: id,
				},
			});
		} catch (e) {
			throw new StandardError(400, 'USER_NOT_FOUND', 'User not found', e, { user });
		}
	}

	static async getUserByNip(nip) {
		try {
			return await models.User.findOne({
				where: {
					nim_nip: nip,
				},
			});
		} catch (e) {
			throw new StandardError(400, 'USER_NOT_FOUND', 'User not found', e, { user });
		}
	}

	static async createUser(user) {
		try {
			return await models.User.create(user);
		} catch (e) {
			throw new StandardError(400, 'USER_NOT_CREATED', 'User not created', e, { user });
		}
	}

	static async changeRole(userId, role) {
		try {
			return await models.User.update(
				{
					role: role,
				},
				{
					where: {
						id: userId,
					},
				}
			);
		} catch (e) {
			throw new StandardError(400, 'USER_NOT_UPDATED', 'User not updated', e, { user });
		}
	}
}

module.exports = UserRepository;
