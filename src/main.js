const dotenv = require('dotenv');
const express = require('express');
const cors = require('./middlewares/cors/index');
const { initialiseDataSource } = require('./db/datasource');
const { LogHelper } = require('./utils/log-helper');

// Using dotenv
dotenv.config();

initialiseDataSource().then((isInitialised) => {
	if (isInitialised) {
		LogHelper.log(`DataSource has been initialised!`);
	} else {
		LogHelper.error(`Could not initialise database connection`);
	}
});

const app = express();

app.use(cors(corsOptions));
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
app.listen(PORT, () => {
	LogHelper.info(`Example app listening on port ${PORT}`);
});
