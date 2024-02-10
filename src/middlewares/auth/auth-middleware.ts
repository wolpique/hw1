import { NextFunction, Request, Response } from "express"
import { jwtService } from "../../application/jwt-service";
import { usersService } from "../../services/users.service";

const login = 'admin'
const password = 'qwerty'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const auth = req.headers['authorization'];

    if (!auth) {
        return res.sendStatus(401)
    }

    const [basic, token] = auth.split(" ");

    if (basic !== "Basic") {
        res.sendStatus(401)
        return
    }

    const decodedData = Buffer.from(token, 'base64').toString()

    const [decodedLogin, decodedPassword] = decodedData.split(":")

    if (decodedLogin !== login || decodedPassword !== password) {
        res.sendStatus(401)
        return
    }

    return next()
}


export const bearerAuth = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization']

    if (!auth) {
        return res.sendStatus(401)
    }

    const token = auth.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)

    if (!userId) {
        return res.sendStatus(401)
    }

    const user = await usersService.findUserById(userId)

    if (!user) {
        return res.sendStatus(401)
    }

    req.user = user
    return next()
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers['authorization']
    const refreshToken = req.cookies['refreshToken']
    if (!accessToken && !refreshToken) {
        return res.status(401).send('Access denied, no token provided ')
    }
    try {
        if (accessToken) {
            const decodedAccessToken = await jwtService.verifyAccessToken(accessToken)
            req.user = decodedAccessToken.user
        }
    } catch (error) {
        if (!refreshToken) {
            return res.status(401).send('Access denied, refresh token is absent')
        }
        try {
            const decodedRefreshToken = await jwtService.verifyRefreshToken(refreshToken)
            const newAccessToken = await jwtService.generateAccessToken({ user: decodedRefreshToken.user })

            res.header('Authorization', newAccessToken)
            return res.send(decoded.user)

        } catch (error) {
            return res.status(400).send('Invalid Token')
        }

        return next()
    }
}
