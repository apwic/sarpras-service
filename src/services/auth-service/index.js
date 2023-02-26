const assert = require('assert-plus');
const SSOServiceClient = require('../../clients/sso-service-client');
const UserRepository = require('../../repositories/user-repository');

class AuthService {
    static async SSOlogin(ticket) {
        const itbUserDetails = await SSOServiceClient.getITBUserDetails(ticket);

        await UserRepository.createUser(itbUserDetails);

        return itbUserDetails;
    }
}

module.exports = AuthService;