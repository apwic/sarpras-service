const PaymentModel = (sequelize, { DataTypes }) => {
	const Payment = sequelize.define('payment', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		amount: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},

		image_proof: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});

	Payment.associate = (models) => {
		Payment.hasOne(models.Booking, {
			foreignKey: 'payment_id',
			onDelete: 'CASCADE',
		});
	};

	return Payment;
};

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

		payment_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'payment',
				key: 'id',
			},
		},

		category: {
			type: DataTypes.ENUM('BUILDING', 'ROOM', 'SELASAR', 'VEHICLE'),
			allowNull: false,
		},

		status: {
			type: DataTypes.ENUM('PENGIN', 'In Progress', 'Approved', 'Canceled'),
			allowNull: false,
		},

		description: {
			type: DataTypes.STRING,
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
		Booking.hasMany(models.BookingBuilding, {
			foreignKey: 'booking_id',
			onDelete: 'CASCADE',
		});
		Booking.hasMany(models.BookingSelasar, {
			foreignKey: 'booking_id',
			onDelete: 'CASCADE',
		});
		Booking.hasMany(models.BookingRoom, {
			foreignKey: 'booking_id',
			onDelete: 'CASCADE',
		});
		Booking.hasMany(models.BookingVehicle, {
			foreignKey: 'booking_id',
			onDelete: 'CASCADE',
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
			type: DataTypes.STRING,
		},
	});

	return ReviewBooking;
};

const LoggingBookingModel = (sequelize, { DataTypes }) => {
	const LoggingBooking = sequelize.define('logging_booking', {
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

		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});

	return LoggingBooking;
};

const BookingBuildingModel = (sequelize, { DataTypes }) => {
	const BookingBuilding = sequelize.define('booking_building', {
		booking_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'booking',
				key: 'id',
			},
			primaryKey: true,
		},

		facility_building_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'facility_building',
				key: 'id',
			},
			primaryKey: true,
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

	return BookingBuilding;
};

const BookingSelasarModel = (sequelize, { DataTypes }) => {
	const BookingSelasar = sequelize.define('booking_selasar', {
		booking_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'booking',
				key: 'id',
			},
			primaryKey: true,
		},

		facility_selasar_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'facility_selasar',
				key: 'id',
			},
			primaryKey: true,
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

	return BookingSelasar;
};

const BookingRoomModel = (sequelize, { DataTypes }) => {
	const BookingRoom = sequelize.define('booking_room', {
		booking_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'booking',
				key: 'id',
			},
			primaryKey: true,
		},

		facility_room_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'facility_room',
				key: 'id',
			},
			primaryKey: true,
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

	return BookingRoom;
};

const BookingVehicleModel = (sequelize, { DataTypes }) => {
	const BookingVehicle = sequelize.define('booking_vehicle', {
		booking_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'booking',
				key: 'id',
			},
			primaryKey: true,
		},

		facility_vehicle_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'facility_vehicle',
				key: 'id',
			},
			primaryKey: true,
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

	return BookingVehicle;
};

module.exports = {
	PaymentModel,
	BookingModel,
	LoggingBookingModel,
	ReviewBookingModel,
	BookingBuildingModel,
	BookingSelasarModel,
	BookingRoomModel,
	BookingVehicleModel,
};
