const path = require('path');
const UserRepository = require('../../repositories/user-repository');
const { userRoles } = require('./constant');
const StandardError = require('../../utils/standard-error');
const { uploadImageUser } = require('../../utils/upload-file');

const fs = require('fs');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);
class UserService {
	static async getUserById(id) {
		try {
			const user = await UserRepository.getUserById(id);

			return {
				message: 'Fetching user successful',
				data: user,
			};
		} catch (err) {
			throw err;
		}
	}

	static async createUser(user) {
		try {
			const createdUser = await UserRepository.createUser(user);

			return {
				message: `Create user with id ${createdUser.id} successful`,
			};
		} catch (err) {
			throw err;
		}
	}

	static async updateUser(id, image, no_telp) {
		try {
			if (image === undefined) {
				if (no_telp === undefined) {
					throw new StandardError(
						400,
						'EMPTY_REQUEST_BODY',
						'Request body cannot be empty!'
					);
				} else {
					await UserRepository.updateUserNumber(id, no_telp);
				}
			} else {
				const imageUrl = await uploadImageUser(
					image,
					`user-${id}${path.parse(image.originalname).ext}`
				);

				await unlinkAsync(`${__basedir}/../public/uploads/${image.originalname}`);

				if (no_telp === undefined) {
					await UserRepository.updateUserImage(id, imageUrl);
				} else {
					await UserRepository.updateUserImageAndNumber(id, imageUrl, no_telp);
				}
			}

			return {
				message: `Update user with id ${id} successful`,
			};
		} catch (err) {
			throw err;
		}
	}

	static async updateUserRole(userId, role) {
		try {
			await UserRepository.changeRole(userId, role);

			return {
				message: `Update user role with role ${role} successful`,
			};
		} catch (err) {
			throw err;
		}
	}

	static async getUserRoles() {
		try {
			return {
				message: 'Fetching users role successful',
				data: {
					booking_staff: await UserRepository.getUserByRole(userRoles.BOOKING_STAFF),
					super_user: await UserRepository.getUserByRole(userRoles.SUPER_USER),
					sanitation_staff: await UserRepository.getUserByRole(
						userRoles.SANITATION_STAFF
					),
					defect_staff: await UserRepository.getUserByRole(userRoles.DEFECT_STAFF),
					safety_staff: await UserRepository.getUserByRole(userRoles.SAFETY_STAFF),
					loss_staff: await UserRepository.getUserByRole(userRoles.LOSS_STAFF),
					admin: await UserRepository.getUserByRole(userRoles.ADMIN),
				},
			};
		} catch (err) {
			throw err;
		}
	}

	static async getUserRolesUnassigned() {
		try {
			const users = await UserRepository.getUserByRole(userRoles.BASIC_USER);

			return {
				message: 'Fetching unassigned users successful',
				data: users,
			};
		} catch (err) {
			throw err;
		}
	}
}

module.exports = UserService;
