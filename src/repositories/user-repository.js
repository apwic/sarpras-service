const {sequelize, models} = require('../db/index');
const {StandardError} = require('../utils/standard-error');

class UserRepository {
    async getUserById(id) {
        try {
            return await models.User.findOne({
                where: {
                    id: id
                }
            });
        } catch (e) {   
            throw new StandardError(
                'USER_NOT_FOUND', 
                'User not found', 
                e, 
                {}
            );
        }
    }

    async createUser(user) {
        try {
            return await models.User.create(user);
        } catch (e) {
            throw new StandardError(
                'USER_NOT_CREATED',
                'User not created',
                e,
                {}
            );
        }
    }

    async changeRole(user) {
        try {
            return await models.User.update({
                role: user.role
            }, {
                where: {
                    id: user.id
                }
            });
        } catch (e) {
            throw new StandardError(
                'USER_NOT_UPDATED', 
                'User not updated',
                e,
                {}
            );
        }
    }
}

module.exports = UserRepository;