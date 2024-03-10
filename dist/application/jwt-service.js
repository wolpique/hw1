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
    generateRefreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = jsonwebtoken_1.default.sign({ userId: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '20s' });
            let result = yield db_1.tokensCollection.insertOne({ refreshToken: refreshToken, isValid: true });
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
    InvalidRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield db_1.tokensCollection.updateOne({ 'refreshToken': refreshToken }, { $set: { isValid: false } });
                return result.modifiedCount === 1;
            }
            catch (error) {
                throw error;
            }
        });
    },
    checkValidityOfToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield db_1.tokensCollection.findOne({ 'refreshToken': refreshToken, 'isValid': true });
            return !!check;
        });
    },
    verifyRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenVerify = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                //const tokenExpirationTime = new Date(tokenVerify.expiredIn * 1000)
                const userId = tokenVerify.userId;
                // const currentTime = new Date()
                // if (tokenExpirationTime < currentTime) {
                //     return { isValid: false, userId }
                // }
                return { isValid: true, userId };
            }
            catch (error) {
                return null;
            }
        });
    },
    verifyAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenVerify = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
                //const tokenExpirationTime = new Date(tokenVerify.expiredIn * 1000)
                const userId = tokenVerify.userId;
                // const currentTime = new Date()
                // if (tokenExpirationTime < currentTime) {
                //     return { isValid: false, userId }
                // }
                return { isValid: true, userId };
            }
            catch (error) {
                return null;
            }
        });
    },
};
