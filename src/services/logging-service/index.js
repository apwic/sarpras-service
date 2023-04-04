const LoggingRepository = require('../../repositories/logging-repository');
const { loggingRoleStatus } = require('./constant');

class LoggingService {
    static __loggingRoleDesc(
        adminId,
        staffId,
        currentRole,
        roleGranted,
        status,
    ) {
        if (status === loggingRoleStatus.GRANT) {
            return `Admin with admin_id = ${adminId} GRANT staff with staff_id = ${staffId} from role ${currentRole} to ${roleGranted}`;
        } else {
            return `Admin with admin_id = ${adminId} REVOKE staff with staff_id = ${staffId} from role ${currentRole} to ${roleGranted}`;
        }
    }

    static __loggingFacilityDesc(facilityId, old_data, new_data) {
        if (old_data && new_data) {
            return `Facility with facility_id = ${facilityId} has been updated`;
        } else if (new_data) {
            return `Facility with facility_id = ${facilityId} has been created`;
        } else {
            return `Facility with facility_id = ${facilityId} has been deleted`;
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
            description: this.__loggingRoleDesc(
                adminId,
                staffId,
                currentRole,
                roleGranted,
                status,
            ),
        };
        await LoggingRepository.createLoggingRole(logging);
    }

    static async createLoggingFacility(
        adminId,
        facilityId,
        old_data,
        new_data,
    ) {
        const EMPTY_JSON = '{}';

        const logging = {
            admin_id: adminId,
            facility_id: facilityId,
            description: this.__loggingFacilityDesc(
                facilityId,
                old_data,
                new_data,
            ),
            old_data: JSON.stringify(old_data) || EMPTY_JSON,
            new_data: JSON.stringify(new_data) || EMPTY_JSON,
        };
        await LoggingRepository.createLoggingFacility(logging);
    }

    static async createLoggingBooking(staffId, bookingId, old_data, new_data) {
        const logging = {
            staff_id: staffId,
            booking_id: bookingId,
            description: `Booking with booking_id = ${bookingId} has been updated`,
            old_data: JSON.stringify(old_data),
            new_data: JSON.stringify(new_data),
        };

        await LoggingRepository.createLoggingBooking(logging);
    }
}

module.exports = LoggingService;
