"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleApiError = void 0;
const axios_1 = require("axios");
const libs_1 = require("@readingForest/libs");
const handleApiError = (error, defaultMessage) => {
    if (error instanceof axios_1.AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.error ||
            error.response?.data?.message ||
            defaultMessage;
        if (status === 404) {
            throw libs_1.Errors.notFound(message);
        }
        if (status === 409) {
            throw libs_1.Errors.conflict(message);
        }
        if (status === 400) {
            throw libs_1.Errors.badRequest(message);
        }
        if (status === 401) {
            throw libs_1.Errors.unauthorized(message);
        }
        if (status === 403) {
            throw libs_1.Errors.forbidden(message);
        }
    }
    libs_1.logger.error('Unexpected error in guardian service', { error });
    throw libs_1.Errors.internalServer(defaultMessage);
};
exports.handleApiError = handleApiError;
//# sourceMappingURL=httpErrorHandler.js.map