const { models } = require('../db/index');
const StandardError = require('../utils/standard-error');

class LoggingRepository {
    static async createLoggingRole(logging) {
        try {
            return await models.LoggingRole.create({
                admin_id: logging.admin_id,
                staff_id: logging.staff_id,
                description: logging.description,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    logging,
                },
            );
        }
    }

    static async getLoggingRoleByAdminId(adminId) {
        try {
            return await models.LoggingRole.findAll({
                where: {
                    admin_id: adminId,
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    adminId,
                },
            );
        }
    }

    static async getLoggingRoleByStaffId(staffId) {
        try {
            return await models.LoggingRole.findAll({
                where: {
                    staff_id: staffId,
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    staffId,
                },
            );
        }
    }
}

module.exports = LoggingRepository;
