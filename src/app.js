const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const cors = require('./middlewares/cors/index');
const { sequelize } = require('./db/index');
const { LogHelper } = require('./utils/log-helper');

const rootController = require('./controllers/root-controller');
const loginController = require('./controllers/login-controller');
const profileController = require('./controllers/profile-controller');
const roleController = require('./controllers/role-controller');
const bookingController = require('./controllers/booking-controller');
const facilityController = require('./controllers/facility-controller');
const campusController = require('./controllers/campus-controller');
const issueController = require('./controllers/issue-controller');

async function setupRoutes(app) {
    app.use('/', rootController());
    app.use('/login', loginController());
    app.use('/profile', profileController());
    app.use('/role', roleController());
    app.use('/booking', bookingController());
    app.use('/facility', facilityController());
    app.use('/campus', campusController());
    app.use('/issue', issueController());
}

async function createApp() {
    const app = express();
    const PORT = process.env.PORT || 8080;

    app.use(morgan('combined'));
    app.use(cors);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    sequelize.sync();

    await setupRoutes(app);

    app.listen(PORT, () => {
        LogHelper.info(`Sarpras Service listening on port ${PORT}`);
    });
}

module.exports = { createApp };
