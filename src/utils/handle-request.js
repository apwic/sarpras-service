module.exports = function(handler) {
    return function(req, res, next) {
        handler(req)
            .then(response => {
                res.locals.response_data = response;

                next(null);
            })
            .catch(err => {
                err.context = {
                    ...err.context,
                    req_body: req.body,
                    req_ip: req.ip,
                    req_params: req.params,
                    req_query: req.query,
                };
                res.status(err.httpStatus? err.httpStatus : 500).json(err);
            });
    };
};