const { models } = require('../db/index');
const StandardError = require('../utils/standard-error');

class CampusRepository {
    static async getCampus(id) {
        try {
            return await models.Campus.findOne({
                where: {
                    id,
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    id,
                },
            );
        }
    }

    static async getCampuses() {
        try {
            return await models.Campus.findAll();
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
            );
        }
    }
}

module.exports = CampusRepository;
