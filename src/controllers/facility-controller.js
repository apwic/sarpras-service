const handleRequest = require('../utils/handle-request');
const buildResponse = require('../utils/build-response');

const uploadFile = require('../middlewares/file');
const JWTMiddleware = require('../middlewares/jwt');

const FacilityService = require('../services/facility-service');
const facilityRouter = require('express').Router();

module.exports = () => {
	facilityRouter.post(
		'/vehicle',
		[JWTMiddleware.verifyToken, uploadFile],
		handleRequest(async (req) => FacilityService.createFacility(req.body, req.files, req.user.id)),
		buildResponse()
	);

	return facilityRouter;
};
