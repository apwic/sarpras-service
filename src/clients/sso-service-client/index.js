const StandardError = require('../../utils/standard-error');
const { LogHelper } = require('../../utils/log-helper');
const client = require('./connector');
const xml2js = require('xml2js');

const { APP_BASE_URL } = process.env;

class SSOServiceClient {
	static async getITBUserDetails(ticket) {
		let itbUserDetails;

		try {
			const loginPageUrl = `${APP_BASE_URL}/login/INA`;
			const encodedLoginPageUrl = encodeURIComponent(loginPageUrl);

			itbUserDetails = (await client.getITBUserDetails(ticket, encodedLoginPageUrl)).data;
		} catch (err) {
			LogHelper.error(err.message);
			throw new StandardError(
				500,
				'SSO_SERVICE_CLIENT_ERROR',
				'Failed to get ITB user details',
				err,
				{ ticket }
			);
		}

		if (!itbUserDetails.includes('authenticationSuccess')) {
			throw new StandardError(
				401,
				'SSO_AUTHENTICATION_FAILED',
				'SSO authentication failed',
				null,
				{
					ticket,
				}
			);
		}

		itbUserDetails = await xml2js.parseStringPromise(itbUserDetails, { explicitArray: false });

		return itbUserDetails;
	}
}

module.exports = SSOServiceClient;
