require('dotenv').config();
const {
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_HOST,
    DATABASE_PORT,
} = process.env;
const { Sequelize, Op } = require('sequelize');
const { UserModel, LoggingRoleModel } = require('./models/user-model');
const {
    IssueModel,
    ReviewIssueModel,
    LoggingIssueModel,
} = require('./models/issue-model');
const {
    FacilityModel,
    CampusModel,
    FacilityBuildingModel,
    FacilitySelasarModel,
    FacilityRoomModel,
    FacilityVehicleModel,
    UtilityModel,
} = require('./models/facility-model');
const {
    PaymentModel,
    BookingModel,
    LoggingBookingModel,
    ReviewBookingModel,
} = require('./models/booking-model');

const sequelize = new Sequelize(
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWORD,
    {
        host: DATABASE_HOST,
        port: DATABASE_PORT,
        dialect: 'postgres',
        define: {
            freezeTableName: true,
        },
        logging: false,
    },
);

const models = {
    User: UserModel(sequelize, Sequelize),
    LoggingRole: LoggingRoleModel(sequelize, Sequelize),
    Issue: IssueModel(sequelize, Sequelize),
    ReviewIssue: ReviewIssueModel(sequelize, Sequelize),
    LoggingIssue: LoggingIssueModel(sequelize, Sequelize),
    Facility: FacilityModel(sequelize, Sequelize),
    Campus: CampusModel(sequelize, Sequelize),
    FacilityBuilding: FacilityBuildingModel(sequelize, Sequelize),
    FacilitySelasar: FacilitySelasarModel(sequelize, Sequelize),
    FacilityRoom: FacilityRoomModel(sequelize, Sequelize),
    FacilityVehicle: FacilityVehicleModel(sequelize, Sequelize),
    UtilityModel: UtilityModel(sequelize, Sequelize),
    Payment: PaymentModel(sequelize, Sequelize),
    Booking: BookingModel(sequelize, Sequelize),
    LoggingBooking: LoggingBookingModel(sequelize, Sequelize),
    ReviewBooking: ReviewBookingModel(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
    if ('associate' in models[key]) {
        models[key].associate(models);
    }
});

module.exports = { sequelize, Op, models };
