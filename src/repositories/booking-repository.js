const { sequelize, Op, models } = require('../db/index');
const StandardError = require('../utils/standard-error');

class BookingRepository {
    static async getBookingByBookingId(bookingId) {
        try {
            return await models.Booking.findOne({
                where: {
                    id: bookingId,
                },
                include: [
                    {
                        model: models.Facility,
                        attributes: ['id', 'name', 'color', 'description'],
                    },
                    {
                        model: models.User,
                        attributes: ['id', 'name', 'email'],
                    },
                ],
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    bookingId,
                },
            );
        }
    }

    static async searchBookingByUserId(userId, query, filter, offset, limit) {
        try {
            return await models.Booking.findAll({
                where: {
                    user_id: userId,
                    ...filter,
                },
                include: [
                    {
                        model: models.Facility,
                        attributes: ['id', 'name', 'description'],
                        where: {
                            name: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                    },
                ],
                offset,
                limit,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    userId,
                },
            );
        }
    }

    static async countBookingByUserId(userId, query, filter) {
        try {
            return await models.Booking.count({
                where: {
                    user_id: userId,
                    ...filter,
                },
                include: [
                    {
                        model: models.Facility,
                        attributes: ['name', 'description'],
                        where: {
                            name: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                    },
                ],
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    userId,
                },
            );
        }
    }

    static async searchBookings(query, filter, offset, limit) {
        try {
            return await models.Booking.findAll({
                where: {
                    ...filter,
                },
                include: [
                    {
                        model: models.Facility,
                        attributes: ['id', 'name', 'description'],
                        where: {
                            name: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                    },
                    {
                        model: models.User,
                        attributes: ['id', 'name', 'email'],
                    },
                ],
                offset,
                limit,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    query,
                    filter,
                    offset,
                    limit,
                },
            );
        }
    }

    static async countBookings(query, filter) {
        try {
            return await models.Booking.count({
                where: {
                    ...filter,
                },
                include: [
                    {
                        model: models.Facility,
                        attributes: ['name', 'description'],
                        where: {
                            name: {
                                [Op.iLike]: `%${query.toLowerCase()}%`,
                            },
                        },
                    },
                ],
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    query,
                    filter,
                },
            );
        }
    }

    static async getBookingByTimestamp(start, end) {
        try {
            return await models.Booking.findAll({
                attributes: [
                    'id',
                    'user_id',
                    'facility_id',
                    'category',
                    'status',
                    'description',
                    'start_timestamp',
                    'end_timestamp',
                    [
                        sequelize.literal(
                            "TO_CHAR(start_timestamp::DATE, 'yyyy-mm-dd')",
                        ),
                        'date',
                    ],
                ],
                where: {
                    [Op.and]: [
                        sequelize.fn(
                            "TO_CHAR(start_timestamp::DATE, 'yyyy-mm-dd') >=",
                            start,
                        ),
                        sequelize.fn(
                            "TO_CHAR(start_timestamp::DATE, 'yyyy-mm-dd') <=",
                            end,
                        ),
                    ],
                },
                include: [
                    {
                        model: models.Facility,
                        attributes: ['id', 'name', 'color'],
                    },
                    {
                        model: models.User,
                        attributes: ['id', 'name', 'email'],
                    },
                ],
                order: ['start_timestamp'],
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    start,
                    end,
                },
            );
        }
    }

    static async getBookingCountByCategoryAndMonth(category, month) {
        try {
            return await models.Booking.count({
                where: {
                    [Op.and]: [
                        sequelize.fn('CATEGORY =', category),
                        sequelize.fn(
                            'EXTRACT (MONTH FROM start_timestamp) = ',
                            month,
                        ),
                    ],
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    category,
                    month,
                },
            );
        }
    }

    static async getBookingCountByCategoryAndYear(category, year) {
        try {
            return await models.Booking.count({
                where: {
                    [Op.and]: [
                        sequelize.fn('CATEGORY =', category),
                        sequelize.fn(
                            'EXTRACT (YEAR FROM start_timestamp) = ',
                            year,
                        ),
                    ],
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    category,
                    year,
                },
            );
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
                price: booking.price,
                status: booking.status,
                description: booking.description,
                url: booking.url,
                start_timestamp: booking.start_timestamp,
                end_timestamp: booking.end_timestamp,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    booking,
                },
            );
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
                },
            );
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    attachment,
                },
            );
        }
    }

    static async createReviewBooking(review) {
        try {
            return await models.ReviewBooking.create({
                booking_id: review.booking_id,
                rating: review.rating,
                description: review.description,
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    review,
                },
            );
        }
    }

    static async getReviewBookingByBookingId(bookingId) {
        try {
            return await models.ReviewBooking.findOne({
                where: {
                    booking_id: bookingId,
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    bookingId,
                },
            );
        }
    }

    static async getBookingByFacilityId(facilityId) {
        try {
            return await models.Booking.findAll({
                where: {
                    facility_id: facilityId,
                },
            });
        } catch (err) {
            throw new StandardError(
                500,
                'DATABASE_ERROR',
                'Error occured in database',
                err,
                {
                    facilityId,
                },
            );
        }
    }
}

module.exports = BookingRepository;
