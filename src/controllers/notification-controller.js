const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const handleRequest = require('../utils/handle-request');
const buildResponse = require('../utils/build-response');

const JWTMiddleware = require('../middlewares/jwt');

const NotificationService = require('../services/notification-service');
const notificationRouter = require('express').Router();

module.exports = () => {
    notificationRouter.get(
        '/my',
        [JWTMiddleware.verifyToken],
        validator.query(
            Joi.object({
                limit: Joi.number().integer().min(1).required(),
            }),
        ),
        handleRequest(async (req) =>
            NotificationService.getLatestNotificationByUserId(
                req.user.id,
                req.query.limit,
            ),
        ),
        buildResponse(),
    );

    notificationRouter.put(
        '/read-all',
        [JWTMiddleware.verifyToken],
        handleRequest(async (req) =>
            NotificationService.readAllNotificationByUserId(req.user.id),
        ),
        buildResponse(),
    );

    return notificationRouter;
};
