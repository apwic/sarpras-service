const { models } = require('../db/index');
const StandardError = require('../utils/standard-error');

class NotificationRepository {
    static async createNotification(notification) {
        try {
            return await models.Notification.create({
                user_id: notification.user_id,
                message: notification.message,
                is_read: false,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error when creating notification',
                err,
                {
                    notification,
                },
            );
        }
    }

    static async getLatestNotificationByUserId(userId, limit = 5) {
        try {
            return await models.Notification.findAll({
                where: {
                    user_id: userId,
                },
                order: [['createdAt', 'DESC']],
                limit: limit,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error when getting 5 latest notification by user id',
                err,
                {
                    userId,
                },
            );
        }
    }

    static async readAllNotificationByUserId(userId) {
        try {
            return await models.Notification.update(
                {
                    is_read: true,
                },
                {
                    where: {
                        user_id: userId,
                    },
                },
            );
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error when reading all notification by user id',
                err,
                {
                    userId,
                },
            );
        }
    }
}

module.exports = NotificationRepository;
