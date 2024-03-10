"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieService = void 0;
exports.cookieService = {
    setRefreshTokenCookie(res, refreshToken) {
        const cookieOptions = {
            httpOnly: true,
            secure: true,
        };
        res.cookie('refreshToken', refreshToken, cookieOptions);
    }
};
