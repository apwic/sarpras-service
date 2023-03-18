const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const handleRequest = require('../utils/handle-request');
const buildResponse = require('../utils/build-response');

const { uploadFile } = require('../middlewares/file');
const JWTMiddleware = require('../middlewares/jwt');

const BookingService = require('../services/booking-service');
const { bookingCategory } = require('../services/booking-service/constant');
const bookingRouter = require('express').Router();

module.exports = () => {
    bookingRouter.get(
        '/my',
        [JWTMiddleware.verifyToken],
        handleRequest(
            async (req) => await BookingService.getBookingByUserId(req.user.id),
        ),
        buildResponse(),
    );

    bookingRouter.get(
        '/stat',
        [JWTMiddleware.verifyToken],
        validator.query(
            Joi.object({
                month: Joi.number().required(),
                year: Joi.number().required(),
            }),
        ),
        handleRequest(
            async (req) =>
                await BookingService.getBookingStat(
                    req.query.month,
                    req.query.year,
                ),
        ),
        buildResponse(),
    );

    bookingRouter.get(
        '/:id',
        [JWTMiddleware.verifyToken],
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        handleRequest(
            async (req) =>
                await BookingService.getBookingByBookingId(req.params.id),
        ),
        buildResponse(),
    );

    bookingRouter.post(
        '/building',
        [JWTMiddleware.verifyToken, uploadFile],
        validator.body(
            Joi.object({
                verifier_id: Joi.number().optional(),
                payment_id: Joi.number().optional(),
                facility_id: Joi.number().required(),
                file: Joi.array().required(),
                cost: Joi.number().optional(),
                status: Joi.string().optional(),
                description: Joi.string().required(),
                start_timestamp: Joi.string().required(),
                end_timestamp: Joi.string().required(),
            }),
        ),
        handleRequest(
            async (req) =>
                await BookingService.createBooking(
                    req.user.id,
                    req.body,
                    req.files,
                    bookingCategory.BUILDING,
                ),
        ),
        buildResponse(),
    );

    bookingRouter.post(
        '/selasar',
        [JWTMiddleware.verifyToken, uploadFile],
        validator.body(
            Joi.object({
                verifier_id: Joi.number().optional(),
                payment_id: Joi.number().optional(),
                facility_id: Joi.number().required(),
                file: Joi.array().required(),
                cost: Joi.number().optional(),
                status: Joi.string().optional(),
                description: Joi.string().required(),
                start_timestamp: Joi.string().required(),
                end_timestamp: Joi.string().required(),
            }),
        ),
        handleRequest(
            async (req) =>
                await BookingService.createBooking(
                    req.user.id,
                    req.body,
                    req.files,
                    bookingCategory.SELASAR,
                ),
        ),
        buildResponse(),
    );

    bookingRouter.post(
        '/room',
        [JWTMiddleware.verifyToken, uploadFile],
        validator.body(
            Joi.object({
                verifier_id: Joi.number().optional(),
                payment_id: Joi.number().optional(),
                facility_id: Joi.number().required(),
                file: Joi.array().required(),
                cost: Joi.number().optional(),
                status: Joi.string().optional(),
                description: Joi.string().required(),
                start_timestamp: Joi.string().required(),
                end_timestamp: Joi.string().required(),
            }),
        ),
        handleRequest(
            async (req) =>
                await BookingService.createBooking(
                    req.user.id,
                    req.body,
                    req.files,
                    bookingCategory.ROOM,
                ),
        ),
        buildResponse(),
    );

    bookingRouter.post(
        '/vehicle',
        [JWTMiddleware.verifyToken, uploadFile],
        validator.body(
            Joi.object({
                verifier_id: Joi.number().optional(),
                payment_id: Joi.number().optional(),
                facility_id: Joi.number().required(),
                file: Joi.array().required(),
                cost: Joi.number().optional(),
                status: Joi.string().optional(),
                description: Joi.string().required(),
                start_timestamp: Joi.string().required(),
                end_timestamp: Joi.string().required(),
            }),
        ),
        handleRequest(
            async (req) =>
                await BookingService.createBooking(
                    req.user.id,
                    req.body,
                    req.files,
                    bookingCategory.VEHICLE,
                ),
        ),
        buildResponse(),
    );

    bookingRouter.post(
        '/review',
        [JWTMiddleware.verifyToken],
        validator.body(
            Joi.object({
                booking_id: Joi.number().required(),
                rating: Joi.number().required(),
                description: Joi.string().required(),
            }),
        ),
        handleRequest(
            async (req) => await BookingService.createReviewBooking(req.body),
        ),
        buildResponse(),
    );

    bookingRouter.get(
        '/:id/review',
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        [JWTMiddleware.verifyToken],
        handleRequest(
            async (req) =>
                await BookingService.getReviewBookingByBookingId(req.params.id),
        ),
        buildResponse(),
    );

    return bookingRouter;
};
