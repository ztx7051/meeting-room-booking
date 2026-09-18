exports.success = (data, message = "ok") => ({ code: 0, data, message });
exports.fail = (code, message) => ({ code, data: null, message });
