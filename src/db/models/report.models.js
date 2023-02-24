const ReportsModel = (sequelize, { DataTypes }) => {
	const Reports = sequelize.define('reports', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		user_creator_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id',
			},
		},

		user_assigned_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id',
			},
		},

		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		category: {
			type: DataTypes.ENUM('Sanitation', 'Defect', 'Safety', 'Loss'),
			allowNull: false,
		},

		status: {
			type: DataTypes.ENUM('Pending', 'In Progress', 'Done', 'Canceled'),
			allowNull: false,
		},

		image: {
			type: DataTypes.ARRAY(DataTypes.STRING),
		},

		description: {
			type: DataTypes.STRING,
		},
	});

	Reports.associate = (models) => {
		Reports.hasOne(models.ReviewReports, {
			foreignKey: 'report_id',
			onDelete: 'CASCADE',
		});
		Reports.hasMany(models.LoggingReports, {
			foreignKey: 'report_id',
			onDelete: 'CASCADE',
		});
	};

	return Reports;
};

const ReviewReportsModel = (sequelize, { DataTypes }) => {
	const ReviewReports = sequelize.define('review_report', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		report_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'reports',
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

	return ReviewReports;
};

const LoggingReportsModel = (sequelize, { DataTypes }) => {
	const LoggingReports = sequelize.define('logging_report', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		report_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'reports',
				key: 'id',
			},
		},

		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});

	return LoggingReports;
};

module.exports = { ReportsModel, LoggingReportsModel, ReviewReportsModel };
