"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRegistrationValidation = exports.authLoginValidation = exports.codeValidationMiddleware = exports.emailValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const input_model_validation_1 = require("../inputModel/input-model-validation");
const db_1 = require("../../db/db");
const loginOrEmailValidation = (0, express_validator_1.body)('loginOrEmail')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 10 })
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    if (/^[a-zA-Z0-9_-]*$/.test(value) || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
        return true;
    }
    else {
        throw new Error('Invalid loginOrEmail');
    }
}))
    .withMessage('Invalid loginOrEmail!');
const passwordValidation = (0, express_validator_1.body)('password')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 20 })
    .withMessage('Invalid password');
const registrationUserEmailValidation = (0, express_validator_1.body)('email')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 30 })
    .isEmail()
    .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.usersCollection.findOne({ 'accountData.email': email });
    if (user) {
        throw new Error('Email already exists');
    }
}))
    .withMessage('Invalid registrationUserEmailValidation!');
const registrationUserLoginValidation = (0, express_validator_1.body)('login')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 10 })
    .matches('^[a-zA-Z0-9_-]*$')
    .custom((login) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.usersCollection.findOne({ 'accountData.login': login });
    if (user) {
        throw new Error('Login already exists');
    }
    else {
        return true;
    }
}))
    .withMessage('Invalid LoginValidation!');
const emailValidation = (0, express_validator_1.body)('email')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 30 })
    .isEmail()
    .custom((isConfirmed) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.usersCollection.findOne({ 'emailConfirmation.isConfirmed': isConfirmed });
    if (isConfirmed === true) {
        throw new Error('Email is already confirmed');
    }
    else {
        return true;
    }
}))
    .withMessage('Invalid emailValidation!');
const codeValidation = (0, express_validator_1.body)('code')
    .isString()
    .trim()
    .notEmpty()
    // .custom(async (isConfirmed) => {
    //     const user = await usersCollection.findOne({ 'emailConfirmation.isConfirmed': isConfirmed })
    //     if (isConfirmed === true) {
    //         throw new Error('Code is already confirmed');
    //     }
    // })
    .withMessage('Invalid codeValidation!');
const emailValidationMiddleware = () => [emailValidation, input_model_validation_1.inputModelValidation];
exports.emailValidationMiddleware = emailValidationMiddleware;
const codeValidationMiddleware = () => [codeValidation, input_model_validation_1.inputModelValidation];
exports.codeValidationMiddleware = codeValidationMiddleware;
const authLoginValidation = () => [loginOrEmailValidation, passwordValidation, input_model_validation_1.inputModelValidation];
exports.authLoginValidation = authLoginValidation;
const authRegistrationValidation = () => [passwordValidation, registrationUserEmailValidation, registrationUserLoginValidation, input_model_validation_1.inputModelValidation];
exports.authRegistrationValidation = authRegistrationValidation;
