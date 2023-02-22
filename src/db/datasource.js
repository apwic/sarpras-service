const typeorm = require('typeorm');

const DATABASE_ENABLE_LOGGING = process.env.DATABASE_ENABLE_LOGGING === 'true';
const DATABASE_ENABLE_SYNC = process.env.DATABASE_ENABLE_SYNC === 'true';

const dataSource = new typeorm.DataSource({
  type: 'postgres',
	host: process.env.DATABASE_HOST || 'localhost',
	port: parseInt(process.env.DATABASE_PORT || '5432'),
	username: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	entities: ['**/*.entity.js'],
	logging: DATABASE_ENABLE_LOGGING,
	synchronize: DATABASE_ENABLE_SYNC,
})

const DATABASE_RETRY_COUNT = process.env.DATABASE_CONNECT_RETRY_COUNT
	? parseInt(process.env.DATABASE_CONNECT_RETRY_COUNT)
	: 5;

const DATABASE_RETRY_INTERVAL_MS = process.env.DATABASE_CONNECT_RETRY_COUNT
	? parseInt(process.env.DATABASE_CONNECT_RETRY_INTERVAL_MS)
	: 5000;

async function initialiseDataSource(retries = DATABASE_RETRY_COUNT) {
  return dataSource
  .initialize()
  .then(() => true)
  .catch((err) => {
    const remainingRetries = retries - 1;
    console.warn(`Could not connect to the database, retrying ${remainingRetries} more time(s)`);
    if (remainingRetries === 0) {
      console.error(`Error during Data Source initialisation:`, err);
      return false;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        initialiseDataSource(remainingRetries).then(resolve);
      }, DATABASE_RETRY_INTERVAL_MS);
    });
  });
}

module.exports = {dataSource, initialiseDataSource}