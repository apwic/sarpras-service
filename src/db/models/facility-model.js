const { sequelize } = require('..');

const FacilityModel = (sequelize, { DataTypes }) => {
	const Facility = sequelize.define('facility', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		category: {
			type: DataTypes.ENUM('BUILDING', 'SELASAR', 'ROOM', 'VEHICLE'),
			allowNull: false,
		},
	});

	Facility.associate = (models) => {
		Facility.hasMany(models.FacilityBuilding, {
			foreignKey: 'id',
			onDelete: 'CASCADE',
		});
		Facility.hasMany(models.FacilitySelasar, {
			foreignKey: 'id',
			onDelete: 'CASCADE',
		});
		Facility.hasMany(models.FacilityRoom, {
			foreignKey: 'id',
			onDelete: 'CASCADE',
		});
		Facility.hasMany(models.FacilityVehicle, {
			foreignKey: 'id',
			onDelete: 'CASCADE',
		});
	};

	return Facility;
};

const CampusModel = (sequelize, { DataTypes }) => {
	const Campus = sequelize.define('campus', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		latitude: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},

		longitude: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
	});

	Campus.associate = (models) => {
		Campus.hasMany(models.FacilityBuilding, {
			foreignKey: 'campus_id',
			onDelete: 'CASCADE',
		});
	};

	return Campus;
};

const FacilityBuildingModel = (sequelize, { DataTypes }) => {
	const FacilityBuilding = sequelize.define('facility_building', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'facility',
				key: 'id',
			},
			primaryKey: true,
			unique: true,
		},

		campus_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'campus',
				key: 'id',
			},
			primaryKey: true,
		},

		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		image: {
			type: DataTypes.ARRAY(DataTypes.STRING),
		},

		capacity: {
			type: DataTypes.INTEGER,
		},
	});

	FacilityBuilding.associate = (models) => {
		FacilityBuilding.hasMany(models.FacilitySelasar, {
			foreignKey: 'facility_building_id',
			onDelete: 'CASCADE',
		});
		FacilityBuilding.hasMany(models.FacilityRoom, {
			foreignKey: 'facility_building_id',
			onDelete: 'CASCADE',
		});
		FacilityBuilding.hasMany(models.BookingBuilding, {
			foreignKey: 'facility_building_id',
			onDelete: 'CASCADE',
		});
	};

	return FacilityBuilding;
};

const FacilitySelasarModel = (sequelize, { DataTypes }) => {
	const FacilitySelasar = sequelize.define('facility_selasar', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'facility',
				key: 'id',
			},
			primaryKey: true,
			unique: true,
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

		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		image: {
			type: DataTypes.ARRAY(DataTypes.STRING),
		},

		capacity: {
			type: DataTypes.INTEGER,
		},
	});

	FacilitySelasar.associate = (models) => {
		FacilitySelasar.hasMany(models.BookingSelasar, {
			foreignKey: 'facility_selasar_id',
			onDelete: 'CASCADE',
		});
	};

	return FacilitySelasar;
};

const FacilityRoomModel = (sequelize, { DataTypes }) => {
	const FacilityRoom = sequelize.define('facility_room', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'facility',
				key: 'id',
			},
			primaryKey: true,
			unique: true,
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

		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		room_code: {
			type: DataTypes.STRING,
		},

		image: {
			type: DataTypes.ARRAY(DataTypes.STRING),
		},

		capacity: {
			type: DataTypes.INTEGER,
		},
	});

	FacilityRoom.associate = (models) => {
		FacilityRoom.hasMany(models.BookingRoom, {
			foreignKey: 'facility_room_id',
			onDelete: 'CASCADE',
		});
	};

	return FacilityRoom;
};

const VehicleTypeModel = (sequelize, { DataTypes }) => {
	const VehicleType = sequelize.define('vehicle_type', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		sim_category: {
			type: DataTypes.ENUM('A', 'B1', 'B2', 'C', 'D'),
			allowNull: false,
		},
	});

	VehicleType.associate = (models) => {
		VehicleType.hasMany(models.FacilityVehicle, {
			foreignKey: 'vehicle_type_id',
			onDelete: 'CASCADE',
		});
	};

	return VehicleType;
};

const FacilityVehicleModel = (sequelize, { DataTypes }) => {
	const FacilityVehicle = sequelize.define('facility_vehicle', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'facility',
				key: 'id',
			},
			primaryKey: true,
			unique: true,
		},

		vehicle_type_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'vehicle_type',
				key: 'id',
			},
			primaryKey: true,
		},

		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		description: {
			type: DataTypes.STRING,
		},

		license_number: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		vehicle_capacity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},

		image: {
			type: DataTypes.ARRAY(DataTypes.STRING),
		},

		status_maintenance: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			default: false,
		},
	});

	FacilityVehicle.associate = (models) => {
		FacilityVehicle.hasMany(models.BookingVehicle, {
			foreignKey: 'facility_vehicle_id',
			onDelete: 'CASCADE',
		});
	};

	return FacilityVehicle;
};

module.exports = {
	FacilityModel,
	CampusModel,
	FacilityBuildingModel,
	FacilitySelasarModel,
	FacilityRoomModel,
	VehicleTypeModel,
	FacilityVehicleModel,
};
