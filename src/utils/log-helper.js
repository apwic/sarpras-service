const ALL_LOG_LEVELS = 'INFO,DEBUG,WARN,ERROR';

const LOG_LEVELS = (process.env.ALLOWED_LOG_LEVELS || ALL_LOG_LEVELS).split(
    ',',
);
const ENABLED_LEVELS = new Set(LOG_LEVELS);

function logger(method, level = 'INFO') {
    return (message, ...optionalParams) => {
        if (ENABLED_LEVELS.has(level)) {
            if (typeof message === 'string') {
                console[method](`[${level}] ${message}`, ...optionalParams);
            } else {
                console[method](`[${level}]`, message, ...optionalParams);
            }
        }
    };
}

const LogHelper = {
    log: logger('log'),
    info: logger('info'),
    debug: logger('debug', 'DEBUG'),
    warn: logger('warn', 'WARN'),
    error: logger('error', 'ERROR'),
};

module.exports = { ALL_LOG_LEVELS, LogHelper };
