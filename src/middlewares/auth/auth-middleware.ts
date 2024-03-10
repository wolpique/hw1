import { NextFunction, Request, Response } from "express"
import { jwtService } from "../../services/jwt-service";
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

    const user = await usersService.findUserById(userId.toString())

    if (!user) {
        return res.sendStatus(401)
    }

    req.user = user
    return next()
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies['refreshToken']

    if (!refreshToken) {

        return res.status(401).send('Access denied, no token provided ')
    }

    const decodedRefreshToken = await jwtService.verifyAndDecodeRefreshToken(refreshToken)


    if (!decodedRefreshToken) {
        res.sendStatus(401)
        return
    }

    return next()

}

