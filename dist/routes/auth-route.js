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
exports.authRoute = void 0;
const express_1 = require("express");
const auth_validator_1 = require("../middlewares/validators/auth-validator");
const users_service_1 = require("../services/users.service");
const users_repository_1 = require("../repositories/users-repository");
const jwt_service_1 = require("../application/jwt-service");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const mongodb_1 = require("mongodb");
const auth_service_1 = require("../services/auth.service");
const cookies_1 = require("../application/cookies");
exports.authRoute = (0, express_1.Router)({});
exports.authRoute.post('/login', (0, auth_validator_1.authLoginValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_service_1.usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (user) {
        const accessToken = yield jwt_service_1.jwtService.generateAccessToken(user);
        const refreshToken = yield jwt_service_1.jwtService.generateRefreshToken(user);
        yield cookies_1.cookieService.setRefreshTokenCookie(res, refreshToken);
        return res.send({ accessToken: accessToken, user: user });
    }
    else {
        return res.sendStatus(401);
    }
}));
exports.authRoute.post('/refresh-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestToken = req.cookies.refreshToken;
    if (!requestToken) {
        return res.status(401).send('Access Denied. No refresh token provided.');
    }
    try {
        const isInvalidToken = yield InvalidRefreshToken.exists({ token: requestToken });
        if (isInvalidToken) {
            return res.status(401).send('Access Denied. No refresh token provided');
        }
        const decoded = yield jwt_service_1.jwtService.verifyRefreshToken(requestToken);
        const user = yield users_service_1.usersService.findUserById(decoded.userId);
        if (!user) {
            return res.sendStatus(401);
        }
        const newAccessToken = yield jwt_service_1.jwtService.generateAccessToken(user);
        const newRefreshToken = yield jwt_service_1.jwtService.generateRefreshToken(user);
        cookies_1.cookieService.setRefreshTokenCookie(res, newRefreshToken);
        return res.send({ accessToken: newAccessToken });
    }
    catch (error) {
        return res.sendStatus(401);
    }
}));
exports.authRoute.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).send('Access Denied. No refresh token provided.');
    }
    try {
        yield InvalidRefreshToken.create({ token: refreshToken });
        res.clearCookie('refreshToken');
        return res.sendStatus(204);
    }
    catch (error) {
        console.error('Error logging out:', error);
        return null;
    }
}));
exports.authRoute.post('/registration', /*limitRequestMiddleware,*/ (0, auth_validator_1.authRegistrationValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, email, password } = req.body;
    const registrationResult = yield auth_service_1.authService.createUser(login, email, password);
    if (registrationResult) {
        res.status(204).send('Successfull registration');
    }
    else {
        res.sendStatus(400);
    }
}));
exports.authRoute.post('/registration-email-resending', /*limitRequestMiddleware,*/ (0, auth_validator_1.emailValidationMiddleware)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resend = yield auth_service_1.authService.emailResending(req.body.email);
    if (!resend) {
        return res.status(400).send({ errorsMessages: [{ message: "Slomalsya", field: "email" }] });
    }
    else {
        return res.status(204).send("Success");
    }
}));
exports.authRoute.post('/registration-confirmation', /*limitRequestMiddleware,*/ (0, auth_validator_1.codeValidationMiddleware)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const confirm = yield auth_service_1.authService.confirmEmail(req.body.code);
    if (confirm) {
        return res.sendStatus(204);
    }
    else {
        return res.status(400).send({ errorsMessages: [{ message: "Slomalsya", field: "code" }] });
    }
}));
exports.authRoute.get('/me', auth_middleware_1.bearerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userData = yield users_repository_1.UsersRepository.findUserById(new mongodb_1.ObjectId(id));
    if (!userData) {
        return res.sendStatus(401);
    }
    return res.sendStatus(200);
}));
