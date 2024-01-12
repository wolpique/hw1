"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputModelValidation = void 0;
const express_validator_1 = require("express-validator");
const inputModelValidation = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).formatWith(error => {
        switch (error.type) {
            case "field":
                return {
                    message: error.msg,
                    field: error.path
                };
            default:
                return {
                    message: error.msg,
                    field: 'not found'
                };
        }
    });
    if (!errors.isEmpty()) {
        const err = errors.array({ onlyFirstError: true });
        return res.status(400).send({
            errorsMessages: err
        });
    }
    return next();
};
exports.inputModelValidation = inputModelValidation;
//validator for objectId -> inputModelValidation 404 if !blogId 
