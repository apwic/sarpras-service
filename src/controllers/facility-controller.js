const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const handleRequest = require('../utils/handle-request');
const buildResponse = require('../utils/build-response');

const { uploadFile } = require('../middlewares/file');
const JWTMiddleware = require('../middlewares/jwt');
const UserValidation = require('../middlewares/user-validation');

const FacilityService = require('../services/facility-service');
const facilityRouter = require('express').Router();

module.exports = () => {
    facilityRouter.post(
        '/vehicle',
        [JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
        validator.body(
            Joi.object({
                pic_id: Joi.number().optional(),
                electricity: Joi.string().optional(),
                utility: Joi.array().optional(),
                price: Joi.number().required(),
                description: Joi.string().required(),
                not_available: Joi.string().optional(),
                campus_id: Joi.number().required(),
                name: Joi.string().required(),
                type: Joi.string().required(),
                sim_category: Joi.string().required(),
                license_number: Joi.string().required(),
                vehicle_capacity: Joi.number().required(),
                image: Joi.array().required(),
                status_maintenance: Joi.boolean().optional(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.createFacilityVehicle(
                req.body,
                req.files,
                req.user.id,
            ),
        ),
        buildResponse(),
    );

    facilityRouter.get(
        '/vehicle/:id',
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.getFacilityVehicle(req.params.id),
        ),
        buildResponse(),
    );

    facilityRouter.delete(
        '/vehicle/:id',
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        [JWTMiddleware.verifyToken, UserValidation.admin],
        handleRequest(async (req) =>
            FacilityService.deleteFacilityVehicle(req.params.id, req.user.id),
        ),
        buildResponse(),
    );

    facilityRouter.put(
        '/vehicle/:id',
        validator.body(
            Joi.object({
                pic_id: Joi.number().optional(),
                electricity: Joi.string().optional(),
                utility: Joi.array().optional(),
                price: Joi.number().optional(),
                description: Joi.string().optional(),
                not_available: Joi.string().optional(),
                campus_id: Joi.number().optional(),
                name: Joi.string().optional(),
                type: Joi.string().optional(),
                sim_category: Joi.string().optional(),
                license_number: Joi.string().optional(),
                vehicle_capacity: Joi.number().optional(),
                image: Joi.array().required(),
                status_maintenance: Joi.boolean().optional(),
            }),
        ),
        [JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
        handleRequest(async (req) =>
            FacilityService.updateFacilityVehicle(
                req.params.id,
                req.body,
                req.files,
                req.user.id,
            ),
        ),
        buildResponse(),
    );

    facilityRouter.get(
        '/vehicles',
        validator.query(
            Joi.object({
                q: Joi.string().required().allow(''),
                page: Joi.number().min(1).required(),
                limit: Joi.number().min(1).required(),
                pic_id: Joi.number().optional(),
                campus_id: Joi.number().optional(),
                type: Joi.string().optional(),
                sim_category: Joi.string().optional(),
                status_maintenance: Joi.boolean().optional(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.searchFacilityVehicle(
                req.query.q,
                {
                    pic_id: req.query.pic_id,
                    campus_id: req.query.campus_id,
                    type: req.query.type,
                    sim_category: req.query.sim_category,
                    status_maintenance: req.query.status_maintenance,
                },
                req.query.page,
                req.query.limit,
            ),
        ),
        buildResponse(),
    );

    facilityRouter.post(
        '/building',
        [JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
        validator.body(
            Joi.object({
                pic_id: Joi.number().optional(),
                electricity: Joi.string().optional(),
                utility: Joi.array().optional(),
                price: Joi.number().required(),
                description: Joi.string().required(),
                not_available: Joi.string().optional(),
                campus_id: Joi.number().required(),
                name: Joi.string().required(),
                capacity: Joi.string().required(),
                latitude: Joi.string().required(),
                longitude: Joi.string().required(),
                image: Joi.array().required(),
                status_maintenance: Joi.boolean().optional(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.createFacilityBuilding(
                req.body,
                req.files,
                req.user.id,
            ),
        ),
        buildResponse(),
    );

    facilityRouter.get(
        '/building/:id',
        [JWTMiddleware.verifyToken],
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.getFacilityBuilding(req.params.id),
        ),
        buildResponse(),
    );

    facilityRouter.delete(
        '/building/:id',
        [JWTMiddleware.verifyToken, UserValidation.admin],
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.deleteFacilityBuilding(req.params.id, req.user.id),
        ),
        buildResponse(),
    );

    facilityRouter.put(
        '/building/:id',
        [JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
        validator.body(
            Joi.object({
                pic_id: Joi.number().optional(),
                electricity: Joi.string().optional(),
                utility: Joi.array().optional(),
                price: Joi.number().optional(),
                description: Joi.string().optional(),
                not_available: Joi.string().optional(),
                campus_id: Joi.number().optional(),
                name: Joi.string().optional(),
                capacity: Joi.string().optional(),
                latitude: Joi.string().optional(),
                longitude: Joi.string().optional(),
                image: Joi.array().required(),
                status_maintenance: Joi.boolean().optional(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.updateFacilityBuilding(
                req.params.id,
                req.body,
                req.files,
                req.user.id,
            ),
        ),
        buildResponse(),
    );

    facilityRouter.get(
        '/buildings',
        validator.query(
            Joi.object({
                q: Joi.string().required().allow(''),
                page: Joi.number().min(1).required(),
                limit: Joi.number().min(1).required(),
                pic_id: Joi.number().optional(),
                campus_id: Joi.number().optional(),
                status_maintenance: Joi.boolean().optional(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.searchFacilityBuilding(
                req.query.q,
                {
                    pic_id: req.query.pic_id,
                    campus_id: req.query.campus_id,
                    status_maintenance: req.query.status_maintenance,
                },
                req.query.page,
                req.query.limit,
            ),
        ),
        buildResponse(),
    );

    facilityRouter.post(
        '/room',
        [JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
        validator.body(
            Joi.object({
                pic_id: Joi.number().optional(),
                electricity: Joi.string().optional(),
                utility: Joi.array().optional(),
                price: Joi.number().required(),
                description: Joi.string().required(),
                not_available: Joi.string().optional(),
                facility_building_id: Joi.number().required(),
                name: Joi.string().required(),
                room_code: Joi.string().required(),
                image: Joi.array().required(),
                capacity: Joi.string().required(),
                status_maintenance: Joi.boolean().optional(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.createFacilityRoom(
                req.body,
                req.files,
                req.user.id,
            ),
        ),
        buildResponse(),
    );

    facilityRouter.get(
        '/room/:id',
        [JWTMiddleware.verifyToken],
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.getFacilityRoom(req.params.id),
        ),
        buildResponse(),
    );

    facilityRouter.delete(
        '/room/:id',
        [JWTMiddleware.verifyToken, UserValidation.admin],
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.deleteFacilityRoom(req.params.id, req.user.id),
        ),
        buildResponse(),
    );

    facilityRouter.put(
        '/room/:id',
        [JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
        validator.body(
            Joi.object({
                pic_id: Joi.number().optional(),
                electricity: Joi.string().optional(),
                utility: Joi.array().optional(),
                price: Joi.number().optional(),
                description: Joi.string().optional(),
                not_available: Joi.string().optional(),
                facility_building_id: Joi.number().optional(),
                name: Joi.string().optional(),
                room_code: Joi.string().optional(),
                image: Joi.array().required(),
                capacity: Joi.string().optional(),
                status_maintenance: Joi.boolean().optional(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.updateFacilityRoom(
                req.params.id,
                req.body,
                req.files,
                req.user.id,
            ),
        ),
        buildResponse(),
    );

    facilityRouter.get(
        '/rooms',
        validator.query(
            Joi.object({
                q: Joi.string().required().allow(''),
                page: Joi.number().min(1).required(),
                limit: Joi.number().min(1).required(),
                pic_id: Joi.number().optional(),
                facility_building_id: Joi.number().optional(),
                status_maintenance: Joi.boolean().optional(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.searchFacilityRoom(
                req.query.q,
                {
                    pic_id: req.query.pic_id,
                    facility_building_id: req.query.facility_building_id,
                    status_maintenance: req.query.status_maintenance,
                },
                req.query.page,
                req.query.limit,
            ),
        ),
        buildResponse(),
    );

    facilityRouter.post(
        '/selasar',
        [JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
        validator.body(
            Joi.object({
                pic_id: Joi.number().optional(),
                electricity: Joi.string().optional(),
                utility: Joi.array().optional(),
                price: Joi.number().required(),
                description: Joi.string().required(),
                not_available: Joi.string().optional(),
                facility_building_id: Joi.number().required(),
                name: Joi.string().required(),
                image: Joi.array().required(),
                capacity: Joi.string().required(),
                status_maintenance: Joi.boolean().optional(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.createFacilitySelasar(
                req.body,
                req.files,
                req.user.id,
            ),
        ),
        buildResponse(),
    );

    facilityRouter.get(
        '/selasar/:id',
        [JWTMiddleware.verifyToken],
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.getFacilitySelasar(req.params.id),
        ),
        buildResponse(),
    );

    facilityRouter.delete(
        '/selasar/:id',
        [JWTMiddleware.verifyToken, UserValidation.admin],
        validator.params(
            Joi.object({
                id: Joi.number().required(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.deleteFacilitySelasar(req.params.id, req.user.id),
        ),
        buildResponse(),
    );

    facilityRouter.put(
        '/selasar/:id',
        [JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
        validator.body(
            Joi.object({
                pic_id: Joi.number().optional(),
                electricity: Joi.string().optional(),
                utility: Joi.array().optional(),
                price: Joi.number().optional(),
                description: Joi.string().optional(),
                not_available: Joi.string().optional(),
                facility_building_id: Joi.number().optional(),
                name: Joi.string().optional(),
                image: Joi.array().required(),
                capacity: Joi.string().optional(),
                status_maintenance: Joi.boolean().optional(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.updateFacilitySelasar(
                req.params.id,
                req.body,
                req.files,
                req.user.id,
            ),
        ),
        buildResponse(),
    );

    facilityRouter.get(
        '/selasars',
        validator.query(
            Joi.object({
                q: Joi.string().required().allow(''),
                page: Joi.number().min(1).required(),
                limit: Joi.number().min(1).required(),
                pic_id: Joi.number().optional(),
                facility_building_id: Joi.number().optional(),
                status_maintenance: Joi.boolean().optional(),
            }),
        ),
        handleRequest(async (req) =>
            FacilityService.searchFacilitySelasar(
                req.query.q,
                {
                    pic_id: req.query.pic_id,
                    facility_building_id: req.query.facility_building_id,
                    status_maintenance: req.query.status_maintenance,
                },
                req.query.page,
                req.query.limit,
            ),
        ),
        buildResponse(),
    );

    return facilityRouter;
};
