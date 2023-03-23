const { getCalendar } = require('./connector');
const StandardError = require('../../utils/standard-error');

class GoogleCalendarClient {
    static async getCalendarPromise(startDate, endDate) {
        try {
            const response = await getCalendar(startDate, endDate);
            return response.data;
        } catch (err) {
            throw new StandardError(
                500,
                'GOOGLE_CALENDAR_ERROR',
                'Unexpected error when getting calendar from Google Calendar',
                err,
            );
        }
    }
}

module.exports = GoogleCalendarClient;
