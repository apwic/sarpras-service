const UserModel = (sequelize, { DataTypes }) => {
	const User = sequelize.define('user', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		role: {
			type: DataTypes.ENUM('BASIC_USER', 'ADMIN', 'SANITATION_STAFF', 'DEFECT_STAFF', 'SAFETY_STAFF', 'LOSS_STAFF', 'BOOKING_STAFF', 'SUPER_USER'),
			allowNull: false,
		},

		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		nim_nip: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},

		token: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		no_telp: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});

	return User;
};

const LoggingRoleModel = (sequelize, { DataTypes }) => {
	const LoggingRole = sequelize.define('logging_role', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		admin_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'user',
				key: 'id',
			},
		},

		staff_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'user',
				key: 'id',
			},
		},

		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});

	return LoggingRole;
};

module.exports = { UserModel, LoggingRoleModel };
