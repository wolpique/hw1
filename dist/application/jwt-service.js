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
dotenv_1.default.config();
exports.jwtService = {
    generateAccessToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
            return accessToken;
        });
    },
    generateRefreshToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
                return refreshToken;
            }
            catch (error) {
                console.error('Error generating refresh token:', error);
                throw error;
            }
        });
    },
    getUserIdByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                return new mongodb_1.ObjectId(result.userId);
            }
            catch (error) {
                return null;
            }
        });
    },
    verifyRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenVerify = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                const tokenExpirationTime = tokenVerify.expiredIn * 1000;
                const currentTime = Date.now();
                if (tokenExpirationTime < currentTime) {
                    return { isValid: false };
                }
                const userId = tokenVerify.user.id;
                return { isValid: true, userId };
            }
            catch (error) {
                console.error('Error while verifying token:', error);
                return { isValid: false };
            }
        });
    },
};
