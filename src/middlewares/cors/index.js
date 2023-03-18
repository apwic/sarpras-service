const cors = require('cors');

let middleware = cors();

if (process.env.CORS_ALLOWED_ORIGINS) {
    const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '').split(',');
    if (allowedOrigins.length) {
        const corsOptions = {
            origin: (origin, callback) => {
                if (
                    allowedOrigins.some((allowedOrigin) =>
                        allowedOrigin.startsWith(origin),
                    )
                ) {
                    callback(null, true);
                } else {
                    callback(
                        new Error('The Current Origin is not allowed by CORS'),
                    );
                }
            },
            optionsSuccessStatus: 200,
        };
        middleware = cors(corsOptions);
    }
}

module.exports = middleware;
