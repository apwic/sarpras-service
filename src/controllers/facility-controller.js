const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const handleRequest = require('../utils/handle-request');
const buildResponse = require('../utils/build-response');

const uploadFile = require('../middlewares/file');
const JWTMiddleware = require('../middlewares/jwt');
const UserValidation = require('../middlewares/user-validation');

const FacilityService = require('../services/facility-service');
const facilityRouter = require('express').Router();

module.exports = () => {
	facilityRouter.post(
		'/vehicle',
		validator.fields(
			Joi.object(
				{ 
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
					status_maintenance: Joi.boolean().optional()
				}
			)
		),
		[JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
		handleRequest(async (req) =>
			FacilityService.createFacilityVehicle(req.body, req.files, req.user.id)
		),
		buildResponse()
	);

	facilityRouter.get(
		'/vehicle/:id',
		validator.params(
			Joi.object(
				{ 
					id: Joi.number().required() 
				}
			)
		),
		handleRequest(async (req) => FacilityService.getFacilityVehicle(req.params.id)),
		buildResponse()
	);

	facilityRouter.delete(
		'/vehicle/:id',
		validator.params(
			Joi.object(
				{ 
					id: Joi.number().required() 
				}
			)
		),
		[JWTMiddleware.verifyToken, UserValidation.admin],
		handleRequest(async (req) => FacilityService.deleteFacilityVehicle(req.params.id)),
		buildResponse()
	);

	facilityRouter.put(
		'/vehicle/:id',
		validator.fields(
			Joi.object(
				{ 
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
					status_maintenance: Joi.boolean().optional()
				}
			)
		),
		[JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
		handleRequest(async (req) =>
			FacilityService.updateFacilityVehicle(req.params.id, req.body, req.files)
		),
		buildResponse()
	);

	facilityRouter.post(
		'/building',
		validator.fields(
			Joi.object(
				{ 
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
					status_maintenance: Joi.boolean().optional()
				}
			)
		),
		[JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
		handleRequest(async (req) =>
			FacilityService.createFacilityBuilding(req.body, req.files, req.user.id)
		),
		buildResponse()
	);

	facilityRouter.get(
		'/building/:id',
		validator.params(
			Joi.object(
				{ 
					id: Joi.number().required() 
				}
			)
		),
		handleRequest(async (req) => FacilityService.getFacilityBuilding(req.params.id)),
		buildResponse()
	);

	facilityRouter.delete(
		'/building/:id',
		validator.params(
			Joi.object(
				{ 
					id: Joi.number().required() 
				}
			)
		),
		[JWTMiddleware.verifyToken, UserValidation.admin],
		handleRequest(async (req) => FacilityService.deleteFacilityBuilding(req.params.id)),
		buildResponse()
	);

	facilityRouter.put(
		'/building/:id',
		validator.fields(
			Joi.object(
				{ 
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
					status_maintenance: Joi.boolean().optional()
				}
			)
		),
		[JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
		handleRequest(async (req) =>
			FacilityService.updateFacilityBuilding(req.params.id, req.body, req.files)
		),
		buildResponse()
	);

	facilityRouter.post(
		'/room',
		validator.fields(
			Joi.object(
				{ 
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
					status_maintenance: Joi.boolean().optional()
				}
			)
		),
		[JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
		handleRequest(async (req) =>
			FacilityService.createFacilityRoom(req.body, req.files, req.user.id)
		),
		buildResponse()
	);

	facilityRouter.get(
		'/room/:id',
		validator.params(
			Joi.object(
				{ 
					id: Joi.number().required() 
				}
			)
		),
		handleRequest(async (req) => FacilityService.getFacilityRoom(req.params.id)),
		buildResponse()
	);

	facilityRouter.delete(
		'/room/:id',
		validator.params(
			Joi.object(
				{ 
					id: Joi.number().required() 
				}
			)
		),
		[JWTMiddleware.verifyToken, UserValidation.admin],
		handleRequest(async (req) => FacilityService.deleteFacilityRoom(req.params.id)),
		buildResponse()
	);

	facilityRouter.put(
		'/room/:id',
		validator.fields(
			Joi.object(
				{ 
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
					status_maintenance: Joi.boolean().optional()
				}
			)
		),
		[JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
		handleRequest(async (req) =>
			FacilityService.updateFacilityRoom(req.params.id, req.body, req.files)
		),
		buildResponse()
	);

	facilityRouter.post(
		'/selasar',
		validator.fields(
			Joi.object(
				{ 
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
					status_maintenance: Joi.boolean().optional()
				}
			)
		),
		[JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
		handleRequest(async (req) =>
			FacilityService.createFacilitySelasar(req.body, req.files, req.user.id)
		),
		buildResponse()
	);

	facilityRouter.get(
		'/selasar/:id',
		validator.params(
			Joi.object(
				{ 
					id: Joi.number().required() 
				}
			)
		),
		handleRequest(async (req) => FacilityService.getFacilitySelasar(req.params.id)),
		buildResponse()
	);

	facilityRouter.delete(
		'/selasar/:id',
		validator.params(
			Joi.object(
				{ 
					id: Joi.number().required() 
				}
			)
		),
		[JWTMiddleware.verifyToken, UserValidation.admin],
		handleRequest(async (req) => FacilityService.deleteFacilitySelasar(req.params.id)),
		buildResponse()
	);

	facilityRouter.put(
		'/selasar/:id',
		validator.fields(
			Joi.object(
				{ 
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
					status_maintenance: Joi.boolean().optional()
				}
			)
		),
		[JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
		handleRequest(async (req) =>
			FacilityService.updateFacilitySelasar(req.params.id, req.body, req.files)
		),
		buildResponse()
	);

	return facilityRouter;
};
