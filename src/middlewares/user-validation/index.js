const StandardError = require('../../utils/standard-error');
const { LogHelper } = require('../../utils/log-helper');

function generateRoleError(req) {
    return new StandardError(
        403,
        'Forbidden',
        'You are not authorized to access this resource',
        {},
        {
            req_body: req.body,
            req_ip: req.ip,
            req_params: req.params,
            req_query: req.query,
        },
    );
}

class UserValidation {
    static basicUser(req, res, next) {
        const { role } = req.user;
        const BASIC_USER_ROLE = 'BASIC_USER';

        if (role !== BASIC_USER_ROLE) {
            const err = generateRoleError(req);
            LogHelper.error(err.message);
            return res.status(403).json(err);
        }

        next();
    }

    static superUser(req, res, next) {
        const { role } = req.user;
        const SUPER_USER_ROLE = 'SUPER_USER';

        if (role !== SUPER_USER_ROLE) {
            const err = generateRoleError(req);
            LogHelper.error(err.message);
            return res.status(403).json(err);
        }

        next();
    }

    static admin(req, res, next) {
        const { role } = req.user;
        const ADMIN_ROLE = 'ADMIN';

        if (role !== ADMIN_ROLE) {
            const err = generateRoleError(req);
            LogHelper.error(err.message);
            return res.status(403).json(err);
        }

        next();
    }

    static bookingStaff(req, res, next) {
        const { role } = req.user;
        const BOOKING_STAFF_ROLE = 'BOOKING_STAFF';

        if (role !== BOOKING_STAFF_ROLE) {
            const err = generateRoleError(req);
            LogHelper.error(err.message);
            return res.status(403).json(err);
        }

        next();
    }

    static issueStaff(req, res, next) {
        const { role } = req.user;
        const ISSUE_STAFF_ROLES = [
            'SANITATION_STAFF',
            'DEFECT_STAFF',
            'SAFETY_STAFF',
            'LOSS_STAFF',
        ];

        if (!ISSUE_STAFF_ROLES.includes(role)) {
            const err = generateRoleError(req);
            LogHelper.error(err.message);
            return res.status(403).json(err);
        }

        next();
    }
}

module.exports = UserValidation;
