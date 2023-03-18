const LoggingRepository = require('../../repositories/logging-repository');
const { loggingRoleStatus } = require('./constant');

class LoggingService {
    static loggingRoleDesc(adminId, staffId, currentRole, roleGranted, status) {
        if (status === loggingRoleStatus.GRANT) {
            return `Admin with admin_id = ${adminId} GRANT staff with staff_id = ${staffId} from role ${currentRole} to ${roleGranted}`;
        } else {
            return `Admin with admin_id = ${adminId} REVOKE staff with staff_id = ${staffId} from role ${currentRole} to ${roleGranted}`;
        }
    }

    static async createLoggingRole(
        adminId,
        staffId,
        currentRole,
        roleGranted,
        status,
    ) {
        const logging = {
            admin_id: adminId,
            staff_id: staffId,
            description: this.loggingRoleDesc(
                adminId,
                staffId,
                currentRole,
                roleGranted,
                status,
            ),
        };
        await LoggingRepository.createLoggingRole(logging);
    }
}

module.exports = LoggingService;
