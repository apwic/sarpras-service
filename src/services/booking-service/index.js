const BookingRepository = require('../../repositories/booking-repository');
const { FileBooking } = require('../../utils/storage');
const { bookingStatus } = require('./constant');
class BookingService {
	static async getBookingByBookingId(bookingId) {
		const booking = await BookingRepository.getBookingByBookingId(bookingId);

		return {
			message: `Fetching booking with id ${bookingId} succesful`,
			data: booking,
		};
	}

	static async getBookingByUserId(userId) {
		const booking = await BookingRepository.getBookingByUserId(userId);

		return {
			message: `Fetching booking with user_id ${userId} succesful`,
			data: booking,
		};
	}

	static async createBooking(userId, body, files, category) {
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
	}

	static async createReviewBooking(body) {
		const review = {
			booking_id: body.booking_id,
			rating: body.rating,
			description: body.description,
		};

		await BookingRepository.createReviewBooking(review);

		return {
			message: 'Review Booking created succesfully',
		};
	}

	static async getReviewBookingByBookingId(bookingId) {
		const review = await BookingRepository.getReviewBookingByBookingId(bookingId);

		return {
			message: `Fetching review booking with booking_id ${bookingId} succesful`,
			data: review,
		};
	}
}

module.exports = BookingService;
