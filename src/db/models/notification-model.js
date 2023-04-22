const NotificationModel = (sequelize, { DataTypes }) => {
    const Notification = sequelize.define('notification', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            },
        },

        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    Notification.associate = (models) => {
        Notification.belongsTo(models.User, {
            foreignKey: 'user_id',
        });
    };

    return Notification;
};

module.exports = { NotificationModel };
