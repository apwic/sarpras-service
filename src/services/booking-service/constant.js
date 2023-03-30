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

module.exports = {
    bookingStatus,
    bookingCategory,
};
