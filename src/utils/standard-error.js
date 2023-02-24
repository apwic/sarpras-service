const assert = require('assert-plus');

class StandardError extends Error {
    constructor(errorCode, message, lastError, context) {
        super(message);

        assert.optionalString(errorCode);
        assert.optionalString(message);
        assert.optionalObject(lastError);
        assert.optionalObject(context);

        this.error_code = errorCode;
        this.message = message;
        this.stack = Error().stack;
        this.lastError = lastError;
        this.context = context;

        if (this.lastError) {
            this.stack += '\n-\n' + lastError.stack;
        }
    }
}

module.exports = StandardError;
