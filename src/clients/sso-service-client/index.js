const StandardError = require('../../utils/standard-error');
const client = require('./connector');
const xml2js = require('xml2js');

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
                500,
                'SSO_SERVICE_CLIENT_ERROR',
                'Failed to get ITB user details',
                err,
                { ticket }
            )
        }

        if (!itbUserDetails.includes('authenticationSuccess')) {
            console.log('masukkk');
            throw new StandardError(
                401,
                'SSO_AUTHENTICATION_FAILED',
                'SSO authentication failed',
                null,
                { ticket }
            )
        }

        itbUserDetails = await xml2js.parseStringPromise(itbUserDetails, { explicitArray: false });

        return itbUserDetails;
    }
}

module.exports = SSOServiceClient;