const Joi = require('joi');
const RootRouter = require('express').Router();

module.exports = () => {
    RootRouter.get('/', (req, res) => {
        res.json({
            message: 'Layanan SarPras ITB Service.',
        });
    })

    return RootRouter;
};
