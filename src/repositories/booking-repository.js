const { models } = require('../db/index');
const StandardError = require('../utils/standard-error');

class BookingRepository {
	static async getBookingByBookingId(bookingId) {
		try {
			return await models.Booking.findOne({
				where: {
					id: bookingId,
				},
			});
		} catch (err) {
			throw new StandardError(500, 'DATABASE_ERROR', 'Error occured in database', err, {
				bookingId,
			});
		}
	}

	static async getBookingByUserId(userId) {
		try {
			return await models.Booking.findAll({
				where: {
					user_id: userId,
				},
			});
		} catch (err) {
			throw new StandardError(500, 'DATABASE_ERROR', 'Error occured in database', err, {
				userId,
			});
		}
	}

	static async createBooking(booking) {
		try {
			return await models.Booking.create({
				user_id: booking.user_id,
				verifier_id: booking.verifier_id,
				payment_id: booking.payment_id,
				facility_id: booking.facility_id,
				category: booking.category,
				attachment: booking.attachment,
				letter: booking.letter,
				cost: booking.cost,
				status: booking.status,
				description: booking.description,
				start_timestamp: booking.start_timestamp,
				end_timestamp: booking.end_timestamp,
			});
		} catch (err) {
			throw new StandardError(500, 'DATABASE_ERROR', 'Error occured in database', err, {
				booking,
			});
		}
	}

	static async updateAttachment(id, attachment) {
		try {
			return await models.Booking.update(
				{
					attachment: attachment,
				},
				{
					where: {
						id: id,
					},
				}
			);
		} catch (err) {
			throw new StandardError(500, 'DATABASE_ERROR', 'Error occured in database', err, {
				booking,
			});
		}
	}
}

module.exports = BookingRepository;
