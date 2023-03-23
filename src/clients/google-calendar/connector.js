const request = require('axios');

const { GCP_API_KEY, GCP_CALENDAR_ID } = process.env;

function getCalendar(startDate, endDate) {
    const uri = `https://www.googleapis.com/calendar/v3/calendars/${GCP_CALENDAR_ID}/events?key=${GCP_API_KEY}&timeMin=${
        startDate + 'T00:00:00Z'
    }&timeMax=${endDate + 'T00:00:00Z'}`;
    return request.get(uri);
}

module.exports = {
    getCalendar,
};
