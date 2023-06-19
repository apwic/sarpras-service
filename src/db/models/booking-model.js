const BookingModel = (sequelize, { DataTypes }) => {
    const Booking = sequelize.define('booking', {
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

        verifier_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
        },

        facility_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'facility',
                key: 'id',
            },
        },

        category: {
            type: DataTypes.ENUM('BUILDING', 'ROOM', 'SELASAR', 'VEHICLE'),
            allowNull: false,
        },

        attachment: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },

        letter: {
            type: DataTypes.STRING,
        },

        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        cost: {
            type: DataTypes.FLOAT,
            default: 0,
            allowNull: false,
        },

        total_price: {
            type: DataTypes.FLOAT,
        },

        rekening_va: {
            type: DataTypes.STRING,
        },

        status: {
            type: DataTypes.ENUM(
                'PENDING',
                'CANCELED',
                'REJECTED',
                'ON_VERIFICATION',
                'WAITING_FOR_RATING',
                'APPROVED',
                'DONE',
            ),
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
        },

        url: {
            type: DataTypes.STRING,
        },

        unit: {
            type: DataTypes.STRING,
        },

        start_timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        end_timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    Booking.associate = (models) => {
        Booking.hasOne(models.ReviewBooking, {
            foreignKey: 'booking_id',
            onDelete: 'CASCADE',
        });
        Booking.hasMany(models.LoggingBooking, {
            foreignKey: 'booking_id',
            onDelete: 'CASCADE',
        });
        Booking.belongsTo(models.Facility, {
            foreignKey: 'facility_id',
        });
        Booking.belongsTo(models.User, {
            foreignKey: 'user_id',
        });
    };

    return Booking;
};

const ReviewBookingModel = (sequelize, { DataTypes }) => {
    const ReviewBooking = sequelize.define('review_booking', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'booking',
                key: 'id',
            },
        },

        rating: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 5,
            },
        },

        description: {
            type: DataTypes.TEXT,
        },
    });

    ReviewBooking.associate = (models) => {
        ReviewBooking.belongsTo(models.Booking, {
            foreignKey: 'booking_id',
        });
    };

    return ReviewBooking;
};

const LoggingBookingModel = (sequelize, { DataTypes }) => {
    const LoggingBooking = sequelize.define('logging_booking', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        staff_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            },
        },

        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'booking',
                key: 'id',
            },
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        old_data: {
            type: DataTypes.TEXT,
        },

        new_data: {
            type: DataTypes.TEXT,
        },
    });

    LoggingBooking.associate = function (models) {
        LoggingBooking.belongsTo(models.Booking, {
            foreignKey: 'booking_id',
        });
        LoggingBooking.belongsTo(models.User, {
            foreignKey: 'staff_id',
        });
    };

    return LoggingBooking;
};

module.exports = {
    BookingModel,
    LoggingBookingModel,
    ReviewBookingModel,
};
