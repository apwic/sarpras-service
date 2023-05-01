const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const handleRequest = require('../utils/handle-request');
const buildResponse = require('../utils/build-response');

const { uploadFile } = require('../middlewares/file');
const JWTMiddleware = require('../middlewares/jwt');

const BookingService = require('../services/booking-service');
const { bookingCategory } = require('../services/booking-service/constant');
const UserValidation = require('../middlewares/user-validation');
const bookingRouter = require('express').Router();

module.exports = () => {
    bookingRouter.get(
        '/my',
        [JWTMiddleware.verifyToken],
        validator.query(
            Joi.object({
                q: Joi.string().required().allow(''),
                page: Joi.number().min(1).required(),
                limit: Joi.number().min(1).required(),
                category: Joi.string().optional(),
                status: Joi.string().optional(),
            }),
        ),
        handleRequest(
            async (req) =>
                await BookingService.searchMyBooking(
                    req.user.id,
                    req.query.q,
                    {
                        category: req.query.category,
                        status: req.query.status,
                    },
                    req.query.page,
                    req.query.limit,
                ),
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
        '/schedule',
        [JWTMiddleware.verifyToken],
        validator.query(
            Joi.object({
                start: Joi.string().required(),
                end: Joi.string().required(),
            }),
        ),
        handleRequest(
            async (req) =>
                await BookingService.getBookingSchedule(
                    req.query.start,
                    req.query.end,
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
                await BookingService.getBookingByBookingId(
                    req.user,
                    req.params.id,
                ),
        ),
        buildResponse(),
    );

    bookingRouter.get(
        '/:id/overview',
        [JWTMiddleware.verifyToken],
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        handleRequest(
            async (req) =>
                await BookingService.getBookingOverview(req.params.id),
        ),
        buildResponse(),
    );

    bookingRouter.get(
        '',
        [JWTMiddleware.verifyToken, UserValidation.bookingStaff],
        validator.query(
            Joi.object({
                q: Joi.string().required().allow(''),
                page: Joi.number().min(1).required(),
                limit: Joi.number().min(1).required(),
                category: Joi.string().optional(),
                status: Joi.string().optional(),
            }),
        ),
        handleRequest(
            async (req) =>
                await BookingService.searchBookings(
                    req.query.q,
                    {
                        category: req.query.category,
                        status: req.query.status,
                    },
                    req.query.page,
                    req.query.limit,
                ),
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
                file: Joi.array().optional(),
                cost: Joi.number().optional(),
                description: Joi.string().required(),
                url: Joi.string().optional(),
                unit: Joi.string().optional(),
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
                file: Joi.array().optional(),
                cost: Joi.number().optional(),
                description: Joi.string().required(),
                url: Joi.string().optional(),
                unit: Joi.string().optional(),
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
                file: Joi.array().optional(),
                cost: Joi.number().optional(),
                description: Joi.string().required(),
                url: Joi.string().optional(),
                unit: Joi.string().optional(),
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
                file: Joi.array().optional(),
                cost: Joi.number().optional(),
                description: Joi.string().required(),
                url: Joi.string().optional(),
                unit: Joi.string().optional(),
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

    bookingRouter.put(
        '/:id',
        [JWTMiddleware.verifyToken, UserValidation.bookingStaff],
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        validator.body(
            Joi.object({
                facility_id: Joi.number().optional(),
                status: Joi.string().required(),
                cost: Joi.number().optional(),
                unit: Joi.string().optional(),
            }),
        ),
        handleRequest(
            async (req) =>
                await BookingService.updateBooking(
                    req.user.id,
                    req.params.id,
                    req.body,
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
