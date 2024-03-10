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
const jwt_service_1 = require("../services/jwt-service");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const auth_service_1 = require("../services/auth.service");
const cookies_1 = require("../application/cookies");
const limit_requests_1 = require("../middlewares/auth/limit-requests");
const device_repository_1 = require("../repositories/device-repository");
exports.authRoute = (0, express_1.Router)({});
exports.authRoute.post('/login', limit_requests_1.limitRequestMiddleware, (0, auth_validator_1.authLoginValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield users_service_1.usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (!user) {
        return res.sendStatus(401);
    }
    if (user) {
        let { accessToken, refreshToken, newdeviceId, decoded, user_id } = yield auth_service_1.authService.loginUser(user);
        yield cookies_1.cookieService.setRefreshTokenCookie(res, refreshToken);
        const signature = refreshToken.split('.')[2];
        yield device_repository_1.DevicesRepository.insertNewSession(user_id, (_a = req.ip) !== null && _a !== void 0 ? _a : 'default', (_b = req.headers['user-agent']) !== null && _b !== void 0 ? _b : 'default', (new Date(decoded === null || decoded === void 0 ? void 0 : decoded.issuedAt)).toISOString(), newdeviceId, signature);
        return res.send({ accessToken: accessToken });
    }
    else {
        return res.sendStatus(401);
    }
}));
exports.authRoute.post('/refresh-token', auth_middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).send('Access Denied. No refresh token provided.');
    }
    try {
        const decoded = yield jwt_service_1.jwtService.verifyAndDecodeRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).send('Refresh token has expired');
        }
        const check = yield jwt_service_1.jwtService.checkValidityOfToken(decoded.userId, decoded.deviceId, refreshToken);
        if (check == false) {
            return res.status(401).send('Access Denied. Invalid refresh token provided.');
        }
        const user = yield users_service_1.usersService.findUserById(decoded.userId);
        if (!user) {
            return res.sendStatus(401);
        }
        //const newdeviceId = new ObjectId().toString()
        const update = yield device_repository_1.DevicesRepository.updateLastActiveDate(user.id);
        if (update == false) {
            return res.status(401).send('LastActiveDate is invalid.');
        }
        const newAccessToken = yield jwt_service_1.jwtService.generateAccessToken(user.id);
        const newRefreshToken = yield jwt_service_1.jwtService.generateAndStoreRefreshToken(user.id, decoded.deviceId); //в ауз сервис
        //const updateDate = await DevicesRepository.updateLastActiveDate(user.id, newdeviceId);
        yield cookies_1.cookieService.setRefreshTokenCookie(res, newRefreshToken);
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
        const decoded = yield jwt_service_1.jwtService.verifyAndDecodeRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).send('Refresh token has expired');
        }
        const check = yield jwt_service_1.jwtService.checkValidityOfToken(decoded.userId, decoded.deviceId, refreshToken);
        if (check == false) {
            return res.status(401).send('Access Denied. Invalid refresh token provided.');
        }
        //await jwtService.InvalidRefreshToken(refreshToken)
        const { userId, deviceId } = decoded;
        const deleted = yield device_repository_1.DevicesRepository.deleteDeviceById(userId, deviceId);
        if (deleted == false) {
            return res.sendStatus(404);
        }
        return res.sendStatus(204);
    }
    catch (error) {
        console.error('Error logging out:', error);
        return null;
    }
}));
exports.authRoute.post('/registration', limit_requests_1.limitRequestMiddleware, (0, auth_validator_1.authRegistrationValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, email, password } = req.body;
    const registrationResult = yield auth_service_1.authService.createUser(login, email, password);
    if (registrationResult) {
        res.status(204).send('Successfull registration');
    }
    else {
        res.sendStatus(400);
    }
}));
exports.authRoute.post('/registration-email-resending', limit_requests_1.limitRequestMiddleware, (0, auth_validator_1.emailValidationMiddleware)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resend = yield auth_service_1.authService.emailResending(req.body.email);
    if (!resend) {
        return res.status(400).send({ errorsMessages: [{ message: "Slomalsya", field: "email" }] });
    }
    else {
        return res.status(204).send("Success");
    }
}));
exports.authRoute.post('/registration-confirmation', limit_requests_1.limitRequestMiddleware, (0, auth_validator_1.codeValidationMiddleware)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const confirm = yield auth_service_1.authService.confirmEmail(req.body.code);
    if (confirm) {
        return res.sendStatus(204);
    }
    else {
        return res.status(400).send({ errorsMessages: [{ message: "Slomalsya", field: "code" }] });
    }
}));
exports.authRoute.get('/me', auth_middleware_1.bearerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.sendStatus(401);
    }
    const accessToken = auth.split(' ')[1];
    const verifyToken = yield jwt_service_1.jwtService.verifyAndDecodeAccessToken(accessToken);
    if (!verifyToken) {
        return res.sendStatus(401);
    }
    const userData = yield users_repository_1.UsersRepository.findUserById(verifyToken.userId);
    if (!userData) {
        return res.sendStatus(401);
    }
    return res.status(200).send({ userId: userData.id, login: userData.login, email: userData.email });
}));
