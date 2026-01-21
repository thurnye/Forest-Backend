"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateParams = exports.validateBody = void 0;
const libs_1 = require("@readingForest/libs");
const validateBody = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            (0, libs_1.fail)(res, errorMessage, 422);
            return;
        }
        req.body = value;
        next();
    };
};
exports.validateBody = validateBody;
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, {
            abortEarly: false,
        });
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            (0, libs_1.fail)(res, errorMessage, 400);
            return;
        }
        req.params = value;
        next();
    };
};
exports.validateParams = validateParams;
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            (0, libs_1.fail)(res, errorMessage, 400);
            return;
        }
        req.query = value;
        next();
    };
};
exports.validateQuery = validateQuery;
//# sourceMappingURL=validate.js.map