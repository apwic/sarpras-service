const JWTMiddleware = require('../middlewares/jwt');

const rootRouter = require('express').Router();

module.exports = () => {
    rootRouter.get('/', (req, res) => {
        const token = JWTMiddleware.createToken(3);
        res.json({
            message: token,
        });
    });

    return rootRouter;
};
