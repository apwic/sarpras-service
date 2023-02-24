const dotenv = require('dotenv');
const express = require('express');
const cors = require('./middlewares/cors/index');
const { sequelize } = require('./db/index');
const { LogHelper } = require('./utils/log-helper');

// Using dotenv
dotenv.config();

const app = express();

app.use(cors);
// Parse request content type - application/json
app.use(express.json());
// Parse request content type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Starting route
app.get('/', (req, res) => {
	res.json({
		message: 'Layanan SarPras ITB Service.',
	});
});

const PORT = process.env.PORT || 8080;

sequelize.sync({ force: true }).then(() => {
	app.listen(PORT, () => {
		LogHelper.info(`Example app listening on port ${PORT}`);
	});
});
