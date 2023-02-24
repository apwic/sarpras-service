const UsersModel = (sequelize, { DataTypes }) => {
	const Users = sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		role: {
			type: DataTypes.ENUM('Basic', 'Admin', 'Staff'),
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

	return Users;
};

const LoggingRolesModel = (sequelize, { DataTypes }) => {
	const LoggingRoles = sequelize.define('logging_role', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		admin_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id',
			},
		},

		staff_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id',
			},
		},

		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});

	return LoggingRoles;
};

module.exports = { UsersModel, LoggingRolesModel };
