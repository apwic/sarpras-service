const handleRequest = require('../utils/handle-request');
const buildResponse = require('../utils/build-response');

const { uploadMultipleFile } = require('../middlewares/file');
const JWTMiddleware = require('../middlewares/jwt');

const BookingService = require('../services/booking-service');
const bookingRouter = require('express').Router();

module.exports = () => {
	bookingRouter.post(
		'/building',
		[JWTMiddleware.verifyToken, uploadMultipleFile],
		handleRequest(async (req) => BookingService.createBooking(req.body, req.files)),
		buildResponse()
	);

	bookingRouter.post('/selasar');

	bookingRouter.post('/room');

	bookingRouter.post('/vehicle');

	return bookingRouter;
};
