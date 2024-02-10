import { Response } from 'express';
import cookie from 'cookie';

export const cookieService = {
    setRefreshTokenCookie(res: Response, refreshToken: string) {
        const cookieOptions = {
            httpOnly: true,
            sameSite: true, //?
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        }
        const setRefreshTokenCookie = cookie.serialize('refreshToken', refreshToken, cookieOptions)
        res.setHeader('Set-Cookie', setRefreshTokenCookie)
    }
}