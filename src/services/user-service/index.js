const UserRepository = require('../../repositories/user-repository');
const { userRoles } = require('./constant');
const StandardError = require('../../utils/standard-error');
const { ImageUserStorage } = require('../../utils/storage');
const LoggingService = require('../logging-service/index');
const NotificationService = require('../notification-service/index');
const { loggingRoleStatus } = require('../logging-service/constant');
const { catchThrows } = require('../../utils/promise');

class UserService {
    static async getUserById(id) {
        const user = await UserRepository.getUserById(id);

        return {
            message: 'User berhasil ditemukan!',
            data: user,
        };
    }

    static async createUser(user) {
        const createdUser = await UserRepository.createUser(user);

        return {
            message: `User dengan id = ${createdUser.id} berhasil dibuat!`,
        };
    }

    static async updateUser(id, image, no_telp) {
        if (image === null) {
            if (no_telp === null) {
                throw new StandardError(
                    400,
                    'EMPTY_REQUEST_BODY',
                    'Request body cannot be empty!',
                );
            } else {
                await UserRepository.updateUserNumber(id, no_telp);
            }
        } else {
            image = image[0];
            const user = await UserRepository.getUserById(id);
            const oldPath = user.image;

            const imageUrl = await ImageUserStorage.upload(image);

            if (oldPath !== '') {
                await catchThrows(ImageUserStorage.delete(oldPath));
            }

            if (no_telp === null) {
                await UserRepository.updateUserImage(id, imageUrl);
            } else {
                await UserRepository.updateUserImageAndNumber(
                    id,
                    imageUrl,
                    no_telp,
                );
            }
        }

        return {
            message: `User dengan id = ${id} berhasil diubah!`,
        };
    }

    static async updateUserRole(adminId, staffId, role) {
        const oldStaff = await UserRepository.getUserById(staffId);

        await UserRepository.changeRole(staffId, role);

        const notificationMessage = `Anda telah dijadikan ${role} oleh admin!`;
        await catchThrows(
            NotificationService.createNotification(
                staffId,
                notificationMessage,
            ),
        );

        if (role === userRoles.BASIC_USER) {
            await catchThrows(
                LoggingService.createLoggingRole(
                    adminId,
                    staffId,
                    oldStaff.role,
                    role,
                    loggingRoleStatus.REVOKE,
                ),
            );
        } else {
            await catchThrows(
                LoggingService.createLoggingRole(
                    adminId,
                    staffId,
                    oldStaff.role,
                    role,
                    loggingRoleStatus.GRANT,
                ),
            );
        }

        return {
            message: `User role dengan role ${role} berhasil diubah!`,
        };
    }

    static async getUserRoles() {
        return {
            message: 'User role berhasil ditemukan!',
            data: {
                booking_staff: await UserRepository.getUserByRole(
                    userRoles.BOOKING_STAFF,
                ),
                super_user: await UserRepository.getUserByRole(
                    userRoles.SUPER_USER,
                ),
                sanitation_staff: await UserRepository.getUserByRole(
                    userRoles.SANITATION_STAFF,
                ),
                defect_staff: await UserRepository.getUserByRole(
                    userRoles.DEFECT_STAFF,
                ),
                safety_staff: await UserRepository.getUserByRole(
                    userRoles.SAFETY_STAFF,
                ),
                loss_staff: await UserRepository.getUserByRole(
                    userRoles.LOSS_STAFF,
                ),
                admin: await UserRepository.getUserByRole(userRoles.ADMIN),
            },
        };
    }

    static async getUserRolesUnassigned() {
        const users = await UserRepository.getUserByRole(userRoles.BASIC_USER);

        return {
            message: 'User unassigned berhasil ditemukan!',
            data: users,
        };
    }
}

module.exports = UserService;
