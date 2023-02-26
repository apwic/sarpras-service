const request = require('axios');

const { SSO_ITB_SERVICE_BASE_URL, APP_BASE_URL } = process.env;

function getITBUserDetails(ticket) {
    const sarprasLoginPageUrl = `${APP_BASE_URL}/login`;
    const encodedAppBaseUrl = encodeURIComponent(sarprasLoginPageUrl);

    return request.get(`${SSO_ITB_SERVICE_BASE_URL}/cas/serviceValidate?ticket=${ticket}?service=${encodedAppBaseUrl}`);
}

module.exports = {
    getITBUserDetails,
};