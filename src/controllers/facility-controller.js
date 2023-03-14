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
		[JWTMiddleware.verifyToken, UserValidation.admin, uploadFile],
		handleRequest(async (req) => FacilityService.createFacilityVehicle(req.body, req.files, req.user.id)),
		buildResponse()
	);

	facilityRouter.get(
		'/vehicle/:id',
		handleRequest(async (req) => FacilityService.getFacilityVehicle(req.params.id)),
		buildResponse()
	);

	return facilityRouter;
};
