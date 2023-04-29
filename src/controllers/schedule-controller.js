const BookingRepository = require('../repositories/booking-repository');

const CronScheduler = {
    updateStatusBooking: BookingRepository.updateStatusPastTimestamp,
};

module.exports = CronScheduler;
