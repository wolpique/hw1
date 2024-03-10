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
exports.jwtService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
dotenv_1.default.config();
exports.jwtService = {
    generateAccessToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = jsonwebtoken_1.default.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: '10s' });
            return accessToken;
        });
    },
    generateAndStoreRefreshToken(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const issuedAt = new Date();
            const refreshToken = jsonwebtoken_1.default.sign({ userId: userId, deviceId, issuedAt }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '40s' });
            const signature = refreshToken.split('.')[2];
            yield db_1.devicesCollection.updateOne({ userId: userId, deviceId: deviceId }, { $set: { 'refreshTokenSignature': signature } });
            return refreshToken;
        });
    },
    getUserIdByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                return new mongodb_1.ObjectId(result.userId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    },
    checkValidityOfToken(userId, deviceId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = refreshToken.split('.')[2];
            const isValid = yield db_1.devicesCollection.findOne({ 'userId': userId, 'deviceId': deviceId });
            if (!isValid || !isValid.refreshTokenSignature) {
                return false;
            }
            console.log('Signature from token:', signature);
            console.log('Stored signature:', isValid === null || isValid === void 0 ? void 0 : isValid.refreshTokenSignature);
            if ((isValid === null || isValid === void 0 ? void 0 : isValid.refreshTokenSignature) !== signature) {
                return false;
            }
            else {
                return true;
            }
        });
    },
    verifyAndDecodeRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenVerify = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const userId = tokenVerify.userId;
            console.log('userId', userId);
            const deviceId = tokenVerify.deviceId;
            console.log('deviceId', deviceId);
            const issuedAt = tokenVerify.issuedAt;
            console.log('issuedAt', issuedAt);
            return { userId, deviceId, issuedAt };
        });
    },
    verifyAndDecodeAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenVerify = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
                const userId = tokenVerify.userId;
                return userId;
            }
            catch (error) {
                return null;
            }
        });
    },
};
