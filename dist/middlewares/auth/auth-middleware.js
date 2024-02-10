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
exports.authenticate = exports.bearerAuth = exports.authMiddleware = void 0;
const jwt_service_1 = require("../../application/jwt-service");
const users_service_1 = require("../../services/users.service");
const login = 'admin';
const password = 'qwerty';
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.sendStatus(401);
    }
    const [basic, token] = auth.split(" ");
    if (basic !== "Basic") {
        res.sendStatus(401);
        return;
    }
    const decodedData = Buffer.from(token, 'base64').toString();
    const [decodedLogin, decodedPassword] = decodedData.split(":");
    if (decodedLogin !== login || decodedPassword !== password) {
        res.sendStatus(401);
        return;
    }
    return next();
});
exports.authMiddleware = authMiddleware;
const bearerAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.sendStatus(401);
    }
    const token = auth.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
    if (!userId) {
        return res.sendStatus(401);
    }
    const user = yield users_service_1.usersService.findUserById(userId);
    if (!user) {
        return res.sendStatus(401);
    }
    req.user = user;
    return next();
});
exports.bearerAuth = bearerAuth;
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers['authorization'];
    const refreshToken = req.cookies['refreshToken'];
    if (!accessToken && !refreshToken) {
        return res.status(401).send('Access denied, no token provided ');
    }
    try {
        if (accessToken) {
            const decodedAccessToken = yield jwt_service_1.jwtService.verifyAccessToken(accessToken);
            req.user = decodedAccessToken.user;
        }
    }
    catch (error) {
        if (!refreshToken) {
            return res.status(401).send('Access denied, refresh token is absent');
        }
        try {
            const decodedRefreshToken = yield jwt_service_1.jwtService.verifyRefreshToken(refreshToken);
            const newAccessToken = yield jwt_service_1.jwtService.generateAccessToken({ user: decodedRefreshToken.user });
            res.header('Authorization', newAccessToken);
            return res.send(decoded.user);
        }
        catch (error) {
            return res.status(400).send('Invalid Token');
        }
        return next();
    }
});
exports.authenticate = authenticate;
