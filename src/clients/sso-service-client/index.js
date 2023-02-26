const StandardError = require('../../utils/standard-error');
const client = require('./connector');

class SSOServiceClient {
    constructor() {}

    async getITBUserDetails() {
        let itbUserDetails;

        try {
            itbUserDetails = await client.getITBUserDetails();
        } catch (err) {
            throw new StandardError(
                'SSO_SERVICE_CLIENT_ERROR',
                'Failed to get ITB user details',
                err,
                { ticket }
            )
        }
    }
}

module.exports = new SSOServiceClient();