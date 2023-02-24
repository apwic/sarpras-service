const express = require('express');
const cors = require('./middlewares/cors/index');
const { sequelize } = require('./db/index');
const { LogHelper } = require('./utils/log-helper');

const rootController = require('./controllers/root-controller');

async function setupRoutes(app) {
    app.use('/', rootController());
}

async function createApp() {
    const app = express();

    app.use(cors);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    await setupRoutes(app);

    const PORT = process.env.PORT || 8080;

    sequelize.sync({ force: true }).then(() => {
        app.listen(PORT, () => {
            LogHelper.info(`Example app listening on port ${PORT}`);
        });
    });
}

module.exports = { createApp };