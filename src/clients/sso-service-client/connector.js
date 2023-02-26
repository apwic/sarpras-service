const request = require('axios');

const { SSO_ITB_SERVICE_BASE_URL, APP_BASE_URL } = process.env;

function getITBUserDetails(ticket, service) {
    const uri =`${SSO_ITB_SERVICE_BASE_URL}/cas/serviceValidate?ticket=${ticket}&service=${service}`
    return request.get(uri);
}

module.exports = {
    getITBUserDetails,
};