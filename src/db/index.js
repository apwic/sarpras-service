require('dotenv').config();
const Sequelize = require('sequelize');
const { UserModel, LoggingRoleModel } = require('./models/user-model');
const { IssueModel, ReviewIssueModel, LoggingIssueModel } = require('./models/issue-model');
const {
  FacilityModel,
  CampusModel,
  FacilityBuildingModel,
  FacilitySelasarModel,
  FacilityRoomModel,
  VehicleTypeModel,
  FacilityVehicleModel
} = require('./models/facility-model');
const {
  PaymentModel,
  BookingModel, 
  LoggingBookingModel,
  ReviewBookingModel,
  BookingBuildingModel,
  BookingSelasarModel,
  BookingRoomModel,
  BookingVehicleModel
} = require("./models/booking-model");

const sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	{
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		dialect: 'postgres',
    define: {
      freezeTableName: true
    }
	}
);

const models = {
	User: UserModel(sequelize, Sequelize),
	LoggingRole: LoggingRoleModel(sequelize, Sequelize),
	Issue: IssueModel(sequelize, Sequelize),
	ReviewIssue: ReviewIssueModel(sequelize, Sequelize),
	LoggingIssue: LoggingIssueModel(sequelize, Sequelize),
  Facility : FacilityModel(sequelize, Sequelize),
  Campus : CampusModel(sequelize, Sequelize),
  FacilityBuilding : FacilityBuildingModel(sequelize, Sequelize),
  FacilitySelasar : FacilitySelasarModel(sequelize, Sequelize),
  FacilityRoom : FacilityRoomModel(sequelize, Sequelize),
  VehicleType : VehicleTypeModel(sequelize, Sequelize),
  FacilityVehicle : FacilityVehicleModel(sequelize, Sequelize),
  Payment : PaymentModel(sequelize, Sequelize),
  Booking :  BookingModel(sequelize, Sequelize),
  LoggingBooking : LoggingBookingModel(sequelize, Sequelize),
  ReviewBooking : ReviewBookingModel(sequelize, Sequelize),
  BookingBuilding : BookingBuildingModel(sequelize, Sequelize),
  BookingSelasar : BookingSelasarModel(sequelize, Sequelize),
  BookingRoom : BookingRoomModel(sequelize, Sequelize),
  BookingVehicle :  BookingVehicleModel(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
	if ('associate' in models[key]) {
		models[key].associate(models);
	}
});

module.exports = { sequelize, models };
