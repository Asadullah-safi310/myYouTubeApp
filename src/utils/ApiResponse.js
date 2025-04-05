class ApiResponse {
    constructor(statusCode, message = 'success', data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = success < 400;
    }

    // static success(message, data, statusCode = 200) {
    //     return new ApiResponse(statusCode, message, data, true);
    // }

    // static error(message, statusCode = 500) {
    //     return new ApiResponse(statusCode, message, null, false);
    // }
}

// module.exports = ApiResponse;
