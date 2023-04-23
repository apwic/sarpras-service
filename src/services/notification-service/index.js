const NotificationRepository = require('../../repositories/notification-repository');
const UserRepository = require('../../repositories/user-repository');
const { catchThrows } = require('../../utils/promise');

class NotificationService {
    static async createNotification(userId, message) {
        const createdNotification =
            await NotificationRepository.createNotification({
                user_id: userId,
                message,
            });

        return {
            message: `Notification with id = ${createdNotification.id} successfully created!`,
        };
    }

    static async createNotificationForRole(role, message) {
        const users = await UserRepository.getUserByRole(role);

        await Promise.all(
            users.map((user) =>
                NotificationRepository.createNotification({
                    user_id: user.id,
                    message,
                }),
            ),
        );

        return {
            message: 'Notifications successfully created!',
        };
    }

    static async getLatestNotificationByUserId(userId, limit = 5) {
        const notifications =
            await NotificationRepository.getLatestNotificationByUserId(
                userId,
                limit,
            );

        return {
            message: 'Notifications successfully retrieved!',
            data: notifications,
        };
    }

    static async readAllNotificationByUserId(userId) {
        await catchThrows(
            NotificationRepository.readAllNotificationByUserId(userId),
        );

        return {
            message: 'Notifications successfully read!',
        };
    }
}

module.exports = NotificationService;
