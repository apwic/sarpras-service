const StandardError = require('../../utils/standard-error');
const client = require('./connector');

const { APP_BASE_URL } = process.env;


class SSOServiceClient {
    static async getITBUserDetails(ticket) {
        let itbUserDetails;

        try {
            const loginPageUrl = `${APP_BASE_URL}/login`;
            const encodedLoginPageUrl = encodeURIComponent(loginPageUrl);

            itbUserDetails = (await client.getITBUserDetails(ticket, encodedLoginPageUrl)).data;

        } catch (err) {
            throw new StandardError(
                'SSO_SERVICE_CLIENT_ERROR',
                'Failed to get ITB user details',
                err,
                { ticket }
            )
        }

        return itbUserDetails;
    }
}

module.exports = SSOServiceClient;