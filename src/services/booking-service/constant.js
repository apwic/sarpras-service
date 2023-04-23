const bookingStatus = {
    PENDING: 'PENDING',
    CANCELED: 'CANCELED',
    REJECTED: 'REJECTED',
    ON_VERIFICATION: 'ON_VERIFICATION',
    WAITING_FOR_RATING: 'WAITING_FOR_RATING',
    APPROVED: 'APPROVED',
    DONE: 'DONE',
};

const bookingCategory = {
    BUILDING: 'BUILDING',
    ROOM: 'ROOM',
    SELASAR: 'SELASAR',
    VEHICLE: 'VEHICLE',
};

const userRoles = {
    ADMIN: 'ADMIN',
    SUPER_USER: 'SUPER_USER',
    BASIC_USER: 'BASIC_USER',
    SANITATION_STAFF: 'SANITATION_STAFF',
    DEFECT_STAFF: 'DEFECT_STAFF',
    SAFETY_STAFF: 'SAFETY_STAFF',
    LOSS_STAFF: 'LOSS_STAFF',
    BOOKING_STAFF: 'BOOKING_STAFF',
};

module.exports = {
    bookingStatus,
    bookingCategory,
    userRoles,
};
