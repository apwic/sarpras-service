const BookingRepository = require('../../repositories/booking-repository');
const { FileBooking } = require('../../utils/storage');
const { bookingStatus } = require('./constant');
class BookingService {
	static async getBookingByBookingId(bookingId) {
		try {
			const booking = await BookingRepository.getBookingByBookingId(bookingId);

			return {
				message: `Fetching booking with id ${bookingId} succesful`,
				data: booking,
			};
		} catch (err) {
			throw err;
		}
	}

	static async getBookingByUserId(userId) {
		try {
			const booking = await BookingRepository.getBookingByUserId(userId);

			return {
				message: `Fetching booking with user_id ${userId} succesful`,
				data: booking,
			};
		} catch (err) {
			throw err;
		}
	}

	static async createBooking(userId, body, files, category) {
		try {
			const booking = {
				user_id: userId,
				verifier_id: null,
				payment_id: null,
				facility_id: body.facility_id,
				category: category,
				attachment: null,
				letter: null,
				cost: body.cost,
				status: bookingStatus.PENDING,
				description: body.description,
				start_timestamp: body.start_timestamp,
				end_timestamp: body.end_timestamp,
			};

			const bookingCreated = await BookingRepository.createBooking(booking);
			const bookingId = bookingCreated.id;

			const uploadedFiles = [];
			await Promise.all(
				files.file.map(async (file) => {
					const fileURL = await FileBooking.upload(bookingId, file);
					uploadedFiles.push(fileURL);
				})
			);

			await BookingRepository.updateAttachment(bookingId, uploadedFiles);

			return {
				message: 'Booking created succesfully',
			};
		} catch (err) {
			throw err;
		}
	}
}

module.exports = BookingService;
