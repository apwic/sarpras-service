const { vehicleType, simCategory } = require('../enums');

const UtilityModel = (sequelize, { DataTypes }) => {
    const Utility = sequelize.define('utility', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        image: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },

        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false,
        },
    });

    return Utility;
};

const FacilityModel = (sequelize, { DataTypes }) => {
    const Facility = sequelize.define('facility', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        pic_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            },
        },

        category: {
            type: DataTypes.ENUM('BUILDING', 'SELASAR', 'ROOM', 'VEHICLE'),
            allowNull: false,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        electricity: {
            type: DataTypes.INTEGER,
        },

        utility: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
        },

        not_available: {
            type: DataTypes.ARRAY(DataTypes.DATE),
        },

        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        color: {
            type: DataTypes.STRING,
        },

        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false,
        },
    });

    Facility.associate = (models) => {
        Facility.hasOne(models.FacilityBuilding, {
            foreignKey: 'id',
            onDelete: 'CASCADE',
        });
        Facility.hasOne(models.FacilitySelasar, {
            foreignKey: 'id',
            onDelete: 'CASCADE',
        });
        Facility.hasOne(models.FacilityRoom, {
            foreignKey: 'id',
            onDelete: 'CASCADE',
        });
        Facility.hasOne(models.FacilityVehicle, {
            foreignKey: 'id',
            onDelete: 'CASCADE',
        });
        Facility.hasMany(models.LoggingFacility, {
            foreignKey: 'facility_id',
            onDelete: 'CASCADE',
        });
        Facility.hasMany(models.Booking, {
            foreignKey: 'facility_id',
            onDelete: 'RESTRICT',
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

        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false,
        },
    });

    Campus.associate = (models) => {
        Campus.hasMany(models.FacilityBuilding, {
            foreignKey: 'campus_id',
        });

        Campus.hasMany(models.FacilityVehicle, {
            foreignKey: 'campus_id',
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

        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        status_maintenance: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false,
        },

        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false,
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
    };

    FacilityBuilding.associate = function (models) {
        FacilityBuilding.belongsTo(models.Facility, {
            foreignKey: 'id',
        });
        FacilityBuilding.belongsTo(models.Campus, {
            foreignKey: 'campus_id',
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

        status_maintenance: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false,
        },

        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false,
        },
    });

    FacilitySelasar.associate = function (models) {
        FacilitySelasar.belongsTo(models.Facility, {
            foreignKey: 'id',
        });
        FacilitySelasar.belongsTo(models.FacilityBuilding, {
            foreignKey: 'facility_building_id',
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

        status_maintenance: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false,
        },

        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false,
        },
    });

    FacilityRoom.associate = function (models) {
        FacilityRoom.belongsTo(models.Facility, {
            foreignKey: 'id',
        });
        FacilityRoom.belongsTo(models.FacilityBuilding, {
            foreignKey: 'facility_building_id',
        });
    };

    return FacilityRoom;
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

        campus_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'campus',
                key: 'id',
            },
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        type: {
            type: DataTypes.ENUM(...vehicleType),
            allowNull: false,
        },

        sim_category: {
            type: DataTypes.ENUM(...simCategory),
            allowNull: false,
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

        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false,
        },
    });

    FacilityVehicle.associate = function (models) {
        FacilityVehicle.belongsTo(models.Facility, {
            foreignKey: 'id',
        });
        FacilityVehicle.belongsTo(models.Campus, {
            foreignKey: 'campus_id',
        });
    };

    return FacilityVehicle;
};

const LoggingFacilityModel = (sequelize, { DataTypes }) => {
    const LoggingFacility = sequelize.define('logging_facility', {
        admin_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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

        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        old_data: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        new_data: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });

    LoggingFacility.associate = function (models) {
        LoggingFacility.belongsTo(models.Facility, {
            foreignKey: 'facility_id',
        });
        LoggingFacility.belongsTo(models.User, {
            foreignKey: 'admin_id',
        });
    };

    return LoggingFacility;
};

module.exports = {
    FacilityModel,
    CampusModel,
    FacilityBuildingModel,
    FacilitySelasarModel,
    FacilityRoomModel,
    FacilityVehicleModel,
    UtilityModel,
    LoggingFacilityModel,
};
