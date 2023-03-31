const BookingRepository = require('../../repositories/booking-repository');
const FacilityRepository = require('../../repositories/facility-repository');
const { FileBookingStorage } = require('../../utils/storage');
const { bookingCategory, bookingStatus } = require('./constant');
const GoogleCalendarClient = require('../../clients/google-calendar');

class BookingService {
    static __filter(filter) {
        const bookingFilter = {};

        if (filter.status) {
            bookingFilter.status = filter.status;
        }

        if (filter.category) {
            bookingFilter.category = filter.category;
        }

        return bookingFilter;
    }

    static async getBookingByBookingId(bookingId) {
        const booking = await BookingRepository.getBookingByBookingId(
            bookingId,
        );

        if (!booking) {
            return {
                message: `Booking dengan id = ${bookingId} tidak ditemukan!`,
                data: null,
            };
        }

        return {
            message: `Booking dengan id = ${bookingId} berhasil ditemukan!`,
            data: booking,
        };
    }

    static async searchMyBooking(userId, query, filter, page, limit) {
        const offset = (page - 1) * limit;
        const bookingFilter = this.__filter(filter);

        const booking = await BookingRepository.searchBookingByUserId(
            userId,
            query,
            bookingFilter,
            offset,
            limit,
        );

        const totalRows = await BookingRepository.countBookingByUserId(
            userId,
            query,
            bookingFilter,
        );

        if (!booking) {
            return {
                message: `Booking dengan user_id = ${userId} tidak ditemukan!`,
                data: [],
            };
        }

        return {
            message: `Booking dengan user_id = ${userId} berhasil ditemukan!`,
            data: {
                total_rows: totalRows,
                rows: booking,
            },
        };
    }

    static async searchBookings(query, filter, page, limit) {
        const offset = (page - 1) * limit;
        const bookingFilter = this.__filter(filter);

        const booking = await BookingRepository.searchBookings(
            query,
            bookingFilter,
            offset,
            limit,
        );

        const totalRows = await BookingRepository.countBookings(
            query,
            bookingFilter,
        );

        if (!booking) {
            return {
                message: 'Booking tidak ditemukan!',
                data: [],
            };
        }

        return {
            message: 'Booking berhasil diteukan!',
            data: {
                total_rows: totalRows,
                rows: booking,
            },
        };
    }

    static async getBookingStat(month, year) {
        return {
            message: `Booking dengan month = ${month} dan year = ${year} berhasil ditemukan!`,
            data: {
                vehicle: {
                    month: await BookingRepository.getBookingCountByCategoryAndMonth(
                        bookingCategory.VEHICLE,
                        month,
                    ),
                    year: await BookingRepository.getBookingCountByCategoryAndYear(
                        bookingCategory.VEHICLE,
                        year,
                    ),
                },
                building: {
                    month: await BookingRepository.getBookingCountByCategoryAndMonth(
                        bookingCategory.BUILDING,
                        month,
                    ),
                    year: await BookingRepository.getBookingCountByCategoryAndYear(
                        bookingCategory.BUILDING,
                        year,
                    ),
                },
                room: {
                    month: await BookingRepository.getBookingCountByCategoryAndMonth(
                        bookingCategory.ROOM,
                        month,
                    ),
                    year: await BookingRepository.getBookingCountByCategoryAndYear(
                        bookingCategory.ROOM,
                        year,
                    ),
                },
                selasar: {
                    month: await BookingRepository.getBookingCountByCategoryAndMonth(
                        bookingCategory.SELASAR,
                        month,
                    ),
                    year: await BookingRepository.getBookingCountByCategoryAndYear(
                        bookingCategory.SELASAR,
                        year,
                    ),
                },
            },
        };
    }

    static async getBookingSchedule(startDate, endDate) {
        const booking = await BookingRepository.getBookingByTimestamp(
            startDate,
            endDate,
        );

        const calendar = await GoogleCalendarClient.getCalendarPromise(
            startDate,
            endDate,
        );

        let holiday = [];

        calendar.items.forEach((day) => {
            holiday.push({
                summary: day.summary,
                description: day.description,
                date: day.start.date,
            });
        });

        if (!booking) {
            return {
                message: `Booking dari ${startDate} sampai ${endDate} tidak ditemukan!`,
                data: null,
            };
        }

        return {
            message: `Booking dari ${startDate} sampai ${endDate} berhasil ditemukan!`,
            data: {
                booking: booking,
                holiday: holiday,
            },
        };
    }

    static async createBooking(userId, body, files, category) {
        const facility = await FacilityRepository.getFacility(body.facility_id);

        if (!facility) {
            return {
                error_message: 'Fasilitas tidak ditemukan!',
            };
        }

        const booking = {
            user_id: userId,
            verifier_id: body.verifier_id || null,
            payment_id: body.payment_id || null,
            facility_id: body.facility_id,
            category: category,
            attachment: null,
            letter: null,
            cost: body.cost || null,
            price: facility.price,
            status: bookingStatus.PENDING,
            description: body.description,
            url: body.url || null,
            start_timestamp: body.start_timestamp,
            end_timestamp: body.end_timestamp,
        };

        const bookingCreated = await BookingRepository.createBooking(booking);
        const bookingId = bookingCreated.id;

        const uploadedFiles = [];
        await Promise.all(
            files.file.map(async (file) => {
                const fileURL = await FileBookingStorage.upload(
                    bookingId,
                    file,
                );
                uploadedFiles.push(fileURL);
            }),
        );

        await BookingRepository.updateAttachment(bookingId, uploadedFiles);

        return {
            message: 'Booking berhasil dibuat!',
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
            message: 'Review Booking berhasil dibuat!',
        };
    }

    static async getReviewBookingByBookingId(bookingId) {
        const review = await BookingRepository.getReviewBookingByBookingId(
            bookingId,
        );

        return {
            message: `Review booking dengan booking_id = ${bookingId} berhasil ditemukan!`,
            data: review,
        };
    }
}

module.exports = BookingService;
