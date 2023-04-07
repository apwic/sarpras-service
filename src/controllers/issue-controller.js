const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const handleRequest = require('../utils/handle-request');
const buildResponse = require('../utils/build-response');

const { uploadFile } = require('../middlewares/file');
const JWTMiddleware = require('../middlewares/jwt');
const UserValidation = require('../middlewares/user-validation');

const IssueService = require('../services/issue-service');
const issueRouter = require('express').Router();

module.exports = () => {
    issueRouter.post(
        '/',
        [JWTMiddleware.verifyToken, UserValidation.basicUser, uploadFile],
        validator.body(
            Joi.object({
                title: Joi.string().required(),
                category: Joi.string()
                    .valid('SANITATION', 'DEFECT', 'SAFETY', 'LOSS')
                    .required(),
                description: Joi.string().required(),
                location: Joi.string().required(),
                image: Joi.array().required(),
            }),
        ),
        handleRequest(async (req) =>
            IssueService.createIssue(req.body, req.files, req.user.id),
        ),
        buildResponse(),
    );

    issueRouter.get(
        '/search',
        [JWTMiddleware.verifyToken, UserValidation.issueStaff],
        validator.query(
            Joi.object({
                q: Joi.string().required().allow(''),
                page: Joi.number().min(1).required(),
                limit: Joi.number().min(1).required(),
                status: Joi.string()
                    .valid('PENDING', 'IN_PROGRESS', 'DONE', 'CANCELED')
                    .optional(),
                category: Joi.string()
                    .valid('SANITATION', 'DEFECT', 'SAFETY', 'LOSS')
                    .optional(),
                user_creator_id: Joi.number().optional(),
                user_assigned_name: Joi.string().optional(),
            }),
        ),
        handleRequest(async (req) =>
            IssueService.searchIssues(
                req.query.q,
                {
                    status: req.query.status,
                    category: req.query.category,
                    user_creator_id: req.query.user_creator_id,
                    user_assigned_name: req.query.user_assigned_name,
                },
                req.query.page,
                req.query.limit,
            ),
        ),
        buildResponse(),
    );

    issueRouter.get(
        '/my',
        [JWTMiddleware.verifyToken, UserValidation.basicUser],
        validator.query(
            Joi.object({
                q: Joi.string().required().allow(''),
                page: Joi.number().min(1).required(),
                limit: Joi.number().min(1).required(),
                status: Joi.string()
                    .valid('PENDING', 'IN_PROGRESS', 'DONE', 'CANCELED')
                    .optional(),
                category: Joi.string()
                    .valid('SANITATION', 'DEFECT', 'SAFETY', 'LOSS')
                    .optional(),
                user_assigned_name: Joi.string().optional(),
            }),
        ),
        handleRequest(async (req) =>
            IssueService.getMyIssues(
                req.query.q,
                {
                    status: req.query.status,
                    category: req.query.category,
                    user_creator_id: req.query.user_creator_id,
                    user_assigned_name: req.query.user_assigned_name,
                },
                req.query.page,
                req.query.limit,
                req.user.id,
            ),
        ),
        buildResponse(),
    );

    issueRouter.post(
        '/review',
        [JWTMiddleware.verifyToken, UserValidation.basicUser],
        validator.body(
            Joi.object({
                issue_id: Joi.number().required(),
                rating: Joi.number().min(1).max(5).required(),
                description: Joi.string().required(),
            }),
        ),
        handleRequest(async (req) =>
            IssueService.reviewIssue(req.body, req.user.id),
        ),
        buildResponse(),
    );

    issueRouter.get(
        '/:id/review',
        [JWTMiddleware.verifyToken],
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        handleRequest(async (req) =>
            IssueService.getReviewIssue(req.params.id, req.user.id),
        ),
        buildResponse(),
    );

    issueRouter.get(
        '/:id',
        [JWTMiddleware.verifyToken],
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        handleRequest(async (req) =>
            IssueService.getIssue(req.params.id, req.user.id),
        ),
        buildResponse(),
    );

    issueRouter.put(
        '/:id/staff',
        [JWTMiddleware.verifyToken, UserValidation.issueStaff, uploadFile],
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        validator.body(
            Joi.object({
                user_assigned_name: Joi.string().optional(),
                category: Joi.string()
                    .valid('SANITATION', 'DEFECT', 'SAFETY', 'LOSS')
                    .optional(),
                status: Joi.string()
                    .valid('PENDING', 'IN_PROGRESS', 'DONE')
                    .optional(),
            }),
        ),
        handleRequest(async (req) =>
            IssueService.updateIssue(
                req.params.id,
                req.body,
                req.files,
                req.user.id,
            ),
        ),
        buildResponse(),
    );

    issueRouter.put(
        '/:id/basic',
        [JWTMiddleware.verifyToken, UserValidation.basicUser, uploadFile],
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        validator.body(
            Joi.object({
                title: Joi.string().optional(),
                category: Joi.string()
                    .valid('SANITATION', 'DEFECT', 'SAFETY', 'LOSS')
                    .optional(),
                description: Joi.string().optional(),
                location: Joi.string().optional(),
            }),
        ),
        handleRequest(async (req) =>
            IssueService.updateIssue(
                req.params.id,
                req.body,
                req.files,
                req.user.id,
            ),
        ),
        buildResponse(),
    );

    issueRouter.delete(
        '/:id',
        [JWTMiddleware.verifyToken, UserValidation.basicUser],
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        handleRequest(async (req) =>
            IssueService.deleteIssue(req.params.id, req.user.id),
        ),
        buildResponse(),
    );

    return issueRouter;
};
