import { Response } from 'express';

export const cookieService = {
    setRefreshTokenCookie(res: Response, refreshToken: string) {
        const cookieOptions = {
            httpOnly: true,
            secure: true,
        }
        res.cookie('refreshToken', refreshToken, cookieOptions)
    }
}