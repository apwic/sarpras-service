const { catchThrows } = require('../../utils/promise');
const { LogHelper } = require('../../utils/log-helper');

module.exports = function handleSseRequest(handlerFunction) {
    return async function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            Connection: 'keep-alive',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
        });

        const interval = setInterval(async () => {
            let responseData = [];
            responseData = await catchThrows(handlerFunction(req));
            if (responseData.error_code) {
                responseData = [];
            }
            console.log(responseData);
            const data = `data: ${JSON.stringify(responseData)}\n\n`;
            res.write(data);
        }, 5000);

        req.on('close', () => {
            clearInterval(interval);
            LogHelper.info('SSE Client closed connection');
        });
    };
};
