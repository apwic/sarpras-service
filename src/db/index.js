require('dotenv').config();
const Sequelize = require('sequelize');
const { UsersModel, LoggingRolesModel } = require('./models/users.models');
const { ReportsModel, ReviewReportsModel, LoggingReportsModel } = require('./models/report.models');

const sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	{
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		dialect: 'postgres',
	}
);

const models = {
	Users: UsersModel(sequelize, Sequelize),
	LoggingRoles: LoggingRolesModel(sequelize, Sequelize),
	Reports: ReportsModel(sequelize, Sequelize),
	ReviewReports: ReviewReportsModel(sequelize, Sequelize),
	LoggingReports: LoggingReportsModel(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
	if ('associate' in models[key]) {
		models[key].associate(models);
	}
});

module.exports = { sequelize, models };
