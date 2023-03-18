const bookingStatus = {
    PENDING: 'PENDING',
    CANCELED: 'CANCELED',
    REJECTED: 'REJECTED',
    ON_VERIFICATION: 'ON_VERIFICATION',
    WAITING_FOR_PAYMENT: 'WAITING_FOR_PAYMENT',
    PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
    ENDED: 'ENDED',
    WAITING_FOR_RATING: 'WAITING_FOR_RATING',
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
