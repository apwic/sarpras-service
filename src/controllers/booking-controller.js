const handleRequest = require('../utils/handle-request');
const buildResponse = require('../utils/build-response');

const uploadFile = require('../middlewares/file');
const JWTMiddleware = require('../middlewares/jwt');

const BookingService = require('../services/booking-service');
const { bookingCategory } = require('../services/booking-service/constant');
const bookingRouter = require('express').Router();

module.exports = () => {
	bookingRouter.get(
		'/my',
		[JWTMiddleware.verifyToken],
		handleRequest(async (req) => await BookingService.getBookingByUserId(req.user.id)),
		buildResponse()
	);

	bookingRouter.get(
		'/:id',
		[JWTMiddleware.verifyToken],
		handleRequest(async (req) => await BookingService.getBookingByBookingId(req.params.id)),
		buildResponse()
	);

	bookingRouter.post(
		'/building',
		[JWTMiddleware.verifyToken, uploadFile],
		handleRequest(
			async (req) =>
				await BookingService.createBooking(
					req.user.id,
					req.body,
					req.files,
					bookingCategory.BUILDING
				)
		),
		buildResponse()
	);

	bookingRouter.post(
		'/selasar',
		[JWTMiddleware.verifyToken, uploadFile],
		handleRequest(
			async (req) =>
				await BookingService.createBooking(
					req.user.id,
					req.body,
					req.files,
					bookingCategory.SELASAR
				)
		),
		buildResponse()
	);

	bookingRouter.post(
		'/room',
		[JWTMiddleware.verifyToken, uploadFile],
		handleRequest(
			async (req) =>
				await BookingService.createBooking(
					req.user.id,
					req.body,
					req.files,
					bookingCategory.ROOM
				)
		),
		buildResponse()
	);

	bookingRouter.post(
		'/vehicle',
		[JWTMiddleware.verifyToken, uploadFile],
		handleRequest(
			async (req) =>
				await BookingService.createBooking(
					req.user.id,
					req.body,
					req.files,
					bookingCategory.VEHICLE
				)
		),
		buildResponse()
	);

	return bookingRouter;
};
