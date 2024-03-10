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
const jwt_service_1 = require("../../services/jwt-service");
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
    const user = yield users_service_1.usersService.findUserById(userId.toString());
    if (!user) {
        return res.sendStatus(401);
    }
    req.user = user;
    return next();
});
exports.bearerAuth = bearerAuth;
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
        return res.status(401).send('Access denied, no token provided ');
    }
    const decodedRefreshToken = yield jwt_service_1.jwtService.verifyAndDecodeRefreshToken(refreshToken);
    if (!decodedRefreshToken) {
        res.sendStatus(401);
        return;
    }
    return next();
});
exports.authenticate = authenticate;
