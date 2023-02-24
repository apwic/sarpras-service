const Joi = require('joi');
const rootRouter = require('express').Router();

module.exports = () => {
    rootRouter.get('/', (req, res) => {
        res.json({
            message: 'Layanan SarPras ITB Service.',
        });
    })

    return rootRouter;
};
