"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieService = void 0;
const cookie_1 = __importDefault(require("cookie"));
exports.cookieService = {
    setRefreshTokenCookie(res, refreshToken) {
        const cookieOptions = {
            httpOnly: true,
            sameSite: true, //?
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        };
        const setRefreshTokenCookie = cookie_1.default.serialize('refreshToken', refreshToken, cookieOptions);
        res.setHeader('Set-Cookie', setRefreshTokenCookie);
    }
};
