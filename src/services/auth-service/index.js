const SSOServiceClient = require('../../clients/sso-service-client');
const UserRepository = require('../../repositories/user-repository');

const { SARPRAS_BASE_URL } = process.env; 

class AuthService {
    static async SSOlogin(ticket) {
        const itbUserDetails = await SSOServiceClient.getITBUserDetails(ticket);

        await UserRepository.createUser(itbUserDetails);

        // TODO: catch throws error sso & repository and create bearer token
        
        const redirectPath = `${SARPRAS_BASE_URL}/login`;
        return redirectPath;
    }
}

module.exports = AuthService;