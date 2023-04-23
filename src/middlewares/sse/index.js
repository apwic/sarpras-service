const { catchThrows } = require('../../utils/promise');
const { LogHelper } = require('../utils/log-helper');

module.exports = function handleSseRequest(handlerFunction) {
    return async function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            Connection: 'keep-alive',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
        });

        let responseData = [];
        responseData = await catchThrows(handlerFunction(req));
        if (responseData.error_code) {
            responseData = [];
        }
        const data = `data: ${JSON.stringify(responseData)}\n\n`;
        res.write(data);

        req.on('close', () => {
            LogHelper.info('SSE Client closed connection');
        });
    };
};
