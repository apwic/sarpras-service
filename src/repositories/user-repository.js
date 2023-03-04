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
			throw new StandardError(400, 'USER_NOT_FOUND', 'User not found', e, { id });
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
			throw new StandardError(400, 'USER_NOT_FOUND', 'User not found', e, { nip });
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
			throw new StandardError(400, 'USER_NOT_UPDATED', 'User not updated', e, {
				userId,
				role,
			});
		}
	}

	static async getUserByRole(role) {
		try {
			return await models.User.findAll({
				where: {
					role: role,
				},
			});
		} catch (e) {
			throw new StandardError(400, 'USER_NOT_FOUND', 'User not found', e, { role });
		}
	}

	static async updateUserImageAndNumber(userId, image, no_telp) {
		try {
			return await models.User.update(
				{
					image: image,
					no_telp: no_telp,
				},
				{
					where: {
						id: userId,
					},
				}
			);
		} catch (e) {
			throw new StandardError(400, 'USER_NOT_FOUND', 'User not found', e, { role });
		}
	}

  static async updateUserImage(userId, image) {
		try {
			return await models.User.update(
				{
					image: image,
				},
				{
					where: {
						id: userId,
					},
				}
			);
		} catch (e) {
			throw new StandardError(400, 'USER_NOT_FOUND', 'User not found', e, { role });
		}
	}

  static async updateUserNumber(userId, no_telp) {
		try {
			return await models.User.update(
				{
					no_telp: no_telp,
				},
				{
					where: {
						id: userId,
					},
				}
			);
		} catch (e) {
			throw new StandardError(400, 'USER_NOT_FOUND', 'User not found', e, { role });
		}
	}
}

module.exports = UserRepository;
