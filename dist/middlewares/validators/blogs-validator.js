"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogValidation = void 0;
const express_validator_1 = require("express-validator");
const input_model_validation_1 = require("../inputModel/input-model-validation");
const nameValidation = (0, express_validator_1.body)('name')
    .isString()
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage('Incorrect name!');
const descriptionValidation = (0, express_validator_1.body)('description')
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Incorrect description!');
const websiteUrlValidation = (0, express_validator_1.body)('websiteUrl')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
    .withMessage('Incorrect website Url!');
const blogValidation = () => [nameValidation, descriptionValidation, websiteUrlValidation, input_model_validation_1.inputModelValidation];
exports.blogValidation = blogValidation;
