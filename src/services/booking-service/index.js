const BookingRepository = require('../../repositories/booking-repository');
const { uploadFileBooking } = require('../../utils/upload-file');
class BookingService {
	static async createBooking(body, files) {
		try {
			const booking = {
				user_id: body.user_id,
				verifier_id: null,
				payment_id: null,
				facility_id: body.facility_id,
				category: body.category,
				attachment: body.attachment,
				letter: null,
				cost: body.cost,
				status: body.status,
				description: body.description,
				start_timestamp: body.start_timestamp,
				end_timestamp: body.end_timestamp,
			};

			const bookingCreated = await BookingRepository.createBooking(booking);
			const bookingId = bookingCreated.id;

			const uploadedFiles = [];
			for (let i = 0; i < files.length; i++) {
				const fileURL = await uploadFileBooking(bookingId, files[i], files[i].filename);
				uploadedFiles.push(fileURL);
			}

			await BookingRepository.updateAttachment(uploadedFiles);

			return {
				message: 'Booking created succesfully',
			};
		} catch (err) {
			throw err;
		}
	}
}

module.exports = BookingService;
