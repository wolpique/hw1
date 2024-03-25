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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRefreshTokenBearerValidator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const device_schema_1 = require("../../domain/schemas/device.schema");
const users_service_1 = require("../../services/users.service");
const authRefreshTokenBearerValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies.refreshToken) {
        return res.sendStatus(401);
    }
    const refreshToken = req.cookies.refreshToken;
    const tokenVerify = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = tokenVerify.userId;
    const deviceId = tokenVerify.deviceId;
    const issuedAt = tokenVerify.issuedAt;
    const signature = refreshToken.split('.')[2];
    const isValid = yield device_schema_1.DevicesModelClass.findOne({ 'userId': userId, 'deviceId': deviceId });
    if (!isValid || !isValid.refreshTokenSignature) {
        return false;
    }
    if ((isValid === null || isValid === void 0 ? void 0 : isValid.refreshTokenSignature) !== signature) {
        return false;
    }
    const user = yield users_service_1.usersService.findUserById(isValid.userId);
    console.log('user', user);
    if (!user) {
        return res.sendStatus(401);
    }
    req.user = user;
    return next();
});
exports.authRefreshTokenBearerValidator = authRefreshTokenBearerValidator;
