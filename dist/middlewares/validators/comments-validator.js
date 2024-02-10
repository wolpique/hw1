"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentValidator = void 0;
const express_validator_1 = require("express-validator");
const input_model_validation_1 = require("../inputModel/input-model-validation");
const contentValidation = (0, express_validator_1.body)('content')
    .isString()
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage('Invalid content!');
const commentValidator = () => [contentValidation, input_model_validation_1.inputModelValidation];
exports.commentValidator = commentValidator;
