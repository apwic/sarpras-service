module.exports = function () {
    return function (req, res) {
        const responseData = res.locals.response_data;
        res.status(200).json(responseData);
    };
};
