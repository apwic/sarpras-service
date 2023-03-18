const assert = require('assert-plus');

class StandardError extends Error {
    constructor(httpStatus, errorCode, message, lastError, context) {
        super(message);

        assert.optionalString(errorCode);
        assert.optionalString(message);
        assert.optionalObject(lastError);
        assert.optionalObject(context);

        this.http_status = httpStatus;
        this.error_code = errorCode;
        this.error_message = message;
        this.stack = Error().stack;
        this.last_error = lastError;
        this.context = context;

        if (this.lastError) {
            this.stack += '\n-\n' + lastError.stack;
        }
    }
}

module.exports = StandardError;
