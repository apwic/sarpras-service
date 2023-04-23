const NotificationRepository = require('../../repositories/notification-repository');
const { catchThrows } = require('../../utils/promise');

class NotificationService {
    static async createNotification(notification) {
        const createdNotification =
            await NotificationRepository.createNotification(notification);

        return {
            message: `Notification with id = ${createdNotification.id} successfully created!`,
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
