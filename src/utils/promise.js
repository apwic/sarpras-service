async function catchThrows(promise) {
    try {
        return await promise;
    } catch (e) {
        if (e.response)
            return {
                status: e.response.status,
                data: e.response.data,
                error_code: e.response.data.error_code || e.response.statusText,
            };
        else if (e.lastError && e.lastError.code === 'ETIMEDOUT')
            return {
                status: 504,
                error_code: 'GATEWAY_TIMEOUT',
            };
        else if (e.error_code && e.message)
            return {
                error_code: e.error_code,
                message: e.message,
            };
        else
            return {
                status: 404,
                error_code: e.error_code || e,
            };
    }
}

function isPromiseError(result) {
    return result && result.error_code;
}

function catchOnly(errorCode, returnValue) {
    return (err) => {
        const { error_code } = err;
        if (error_code === errorCode) return returnValue;
        throw err;
    };
}

module.exports = {
    catchOnly,
    catchThrows,
    isPromiseError,
};
