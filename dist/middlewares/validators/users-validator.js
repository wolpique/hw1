"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersValidator = void 0;
const express_validator_1 = require("express-validator");
const input_model_validation_1 = require("../inputModel/input-model-validation");
const loginValidator = (0, express_validator_1.body)('login')
    .isString()
    .trim()
    .isLength({ min: 3, max: 10 })
    .matches('^[a-zA-Z0-9_-]*$')
    .withMessage('Invalid login');
const passwordValidator = (0, express_validator_1.body)('password')
    .isString()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Invalid password');
const emailValidator = (0, express_validator_1.body)('email')
    .isString()
    .trim()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Invalid email');
const usersValidator = () => [loginValidator, passwordValidator, emailValidator, input_model_validation_1.inputModelValidation];
exports.usersValidator = usersValidator;
