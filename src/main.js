const express = require("express");
const cors = require("cors");
const typeorm = require("typeorm");
const { initialiseDataSource } = require("./db/datasource.js");
const { LogHelper } = require("./utils/log-helper.js");

initialiseDataSource().then((isInitialised) => {
	if (isInitialised) {
		LogHelper.log(`DataSource has been initialised!`);
	} else {
		LogHelper.error(`Could not initialise database connection`);
	}
});

const app = express();

// Change later
var corsOptions = {
  origin: 'http://localhost:8000'
}

app.use(cors(corsOptions));
// Parse request content type - application/json
app.use(express.json());
// Parse request content type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// Starting route
app.get("/", (req, res) => {
  res.json({
    message: "Layanan SarPras ITB Service."
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  LogHelper.info(`Example app listening on port ${PORT}`);
});