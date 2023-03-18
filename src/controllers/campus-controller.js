const handleRequest = require('../utils/handle-request');
const buildResponse = require('../utils/build-response');

const CampusService = require('../services/campus-service');
const campusRouter = require('express').Router();

module.exports = () => {
    campusRouter.get(
        '/',
        handleRequest(async () => await CampusService.getCampuses()),
        buildResponse(),
    );

    return campusRouter;
};
