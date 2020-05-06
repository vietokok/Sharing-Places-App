// to create new Error Object to reuse
class HttpError extends Error {
	constructor(message, errorCode) {
		super(message);
		this.code = errorCode;
	}
}

module.exports = HttpError;
