module.exports = function () {
	return function (req, res, next) {
		const responseData = res.locals.response_data;
		res.status(200).json(responseData);
	};
};
