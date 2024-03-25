import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import { DevicesModelClass } from "../../domain/schemas/device.schema"
import { usersService } from "../../services/users.service"

export const authRefreshTokenBearerValidator = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.refreshToken) {
        return res.sendStatus(401)
    }

    const refreshToken: string = req.cookies.refreshToken
    const tokenVerify: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)

    const userId = tokenVerify.userId

    const deviceId = tokenVerify.deviceId

    const issuedAt = tokenVerify.issuedAt

    const signature = refreshToken.split('.')[2];


    const isValid = await DevicesModelClass.findOne({ 'userId': userId, 'deviceId': deviceId })

    if (!isValid || !isValid.refreshTokenSignature) {
        return false;
    }
    if (isValid?.refreshTokenSignature !== signature) {
        return false
    }

    const user = await usersService.findUserById(isValid.userId)
    console.log('user', user)

    if (!user) {
        return res.sendStatus(401);
    }
    req.user = user
    return next()

}