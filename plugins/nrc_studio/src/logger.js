let LOG_PATH = null;
try {
	LOG_PATH = require('path').join(require('os').tmpdir(), 'nrc_studio.log');
} catch (e) { /* web version */ }

const _logLines = [];

function _flushLog() {
	if (!LOG_PATH) return;
	try {
		require('fs').writeFileSync(LOG_PATH, _logLines.join('\n') + '\n', 'utf-8');
	} catch (e) { /* ignore in web */ }
}

export function nrcLog() {
	const msg = '[NRC Studio] ' + Array.from(arguments).join(' ');
	console.log(msg);
	_logLines.push(new Date().toISOString().slice(11, 23) + ' ' + msg);
	_flushLog();
}

export function nrcWarn() {
	const msg = '[NRC Studio] WARN ' + Array.from(arguments).join(' ');
	console.warn(msg);
	_logLines.push(new Date().toISOString().slice(11, 23) + ' ' + msg);
	_flushLog();
}
