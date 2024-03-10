import { Router, Request, Response } from "express";
import { RequestWithBody } from "../models/common/common";
import { authLoginValidation, authRegistrationValidation, codeValidationMiddleware, emailValidationMiddleware } from "../middlewares/validators/auth-validator";
import { usersService } from "../services/users.service";
import { AuthLoginModel } from "../models/auth/auth-model/auth-login-models";
import { UsersRepository } from "../repositories/users-repository";
import { jwtService } from "../services/jwt-service";
import { authenticate, bearerAuth } from "../middlewares/auth/auth-middleware";
import { authService } from "../services/auth.service";
import { UserInputModel } from "../models/users/input/user-input-mode";
import { cookieService } from "../application/cookies";
import { limitRequestMiddleware } from "../middlewares/auth/limit-requests";
import { DevicesRepository } from "../repositories/device-repository";
import { ObjectId } from "mongodb";


export const authRoute = Router({})


authRoute.post('/login', limitRequestMiddleware, authLoginValidation(), async (req: RequestWithBody<AuthLoginModel>, res: Response) => {

    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!user) {
        return res.sendStatus(401)
    }

    if (user) {
        let { accessToken, refreshToken, newdeviceId, decoded, user_id } = await authService.loginUser(user)
        await cookieService.setRefreshTokenCookie(res, refreshToken)

        const signature = refreshToken.split('.')[2];

        await DevicesRepository.insertNewSession(
            user_id,
            req.ip ?? 'default',
            req.headers['user-agent'] ?? 'default',
            (new Date(decoded?.issuedAt)).toISOString(),
            newdeviceId,
            signature
        )

        return res.send({ accessToken: accessToken })

    } else {
        return res.sendStatus(401)
    }
})

authRoute.post('/refresh-token', authenticate, async (req: RequestWithBody<{ id: string, refreshToken: string }>, res: Response) => {

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {

        return res.status(401).send('Access Denied. No refresh token provided.')
    }
    try {

        const decoded = await jwtService.verifyAndDecodeRefreshToken(refreshToken)

        if (!decoded) {

            return res.status(401).send('Refresh token has expired')
        }

        const check = await jwtService.checkValidityOfToken(decoded.userId, decoded.deviceId, refreshToken)

        if (check == false) {
            return res.status(401).send('Access Denied. Invalid refresh token provided.')
        }

        const user = await usersService.findUserById(decoded.userId);
        if (!user) {

            return res.sendStatus(401);
        }
        //const newdeviceId = new ObjectId().toString()

        const update = await DevicesRepository.updateLastActiveDate(user.id);
        if (update == false) {
            return res.status(401).send('LastActiveDate is invalid.')
        }

        const newAccessToken = await jwtService.generateAccessToken(user.id)
        const newRefreshToken = await jwtService.generateAndStoreRefreshToken(user.id, decoded.deviceId); //в ауз сервис

        //const updateDate = await DevicesRepository.updateLastActiveDate(user.id, newdeviceId);
        await cookieService.setRefreshTokenCookie(res, newRefreshToken)
        return res.send({ accessToken: newAccessToken })
    } catch (error) {
        return res.sendStatus(401)
    }
})

authRoute.post('/logout', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).send('Access Denied. No refresh token provided.');
    }

    try {

        const decoded = await jwtService.verifyAndDecodeRefreshToken(refreshToken)


        if (!decoded) {
            return res.status(401).send('Refresh token has expired')
        }
        const check = await jwtService.checkValidityOfToken(decoded.userId, decoded.deviceId, refreshToken)

        if (check == false) {
            return res.status(401).send('Access Denied. Invalid refresh token provided.')
        }

        //await jwtService.InvalidRefreshToken(refreshToken)

        const { userId, deviceId } = decoded
        const deleted = await DevicesRepository.deleteDeviceById(userId, deviceId)
        if (deleted == false) {
            return res.sendStatus(404)
        }
        return res.sendStatus(204)
    } catch (error) {
        console.error('Error logging out:', error);
        return null
    }

})

authRoute.post('/registration', limitRequestMiddleware, authRegistrationValidation(), async (req: RequestWithBody<UserInputModel>, res: Response) => {
    const { login, email, password } = req.body
    const registrationResult = await authService.createUser(login, email, password)
    if (registrationResult) {
        res.status(204).send('Successfull registration')
    } else {
        res.sendStatus(400)
    }
})

authRoute.post('/registration-email-resending', limitRequestMiddleware, emailValidationMiddleware(), async (req: RequestWithBody<{ email: string }>, res: Response) => {
    const resend = await authService.emailResending(req.body.email)
    if (!resend) {
        return res.status(400).send({ errorsMessages: [{ message: "Slomalsya", field: "email" }] })
    } else {
        return res.status(204).send("Success")
    }
})

authRoute.post('/registration-confirmation', limitRequestMiddleware, codeValidationMiddleware(), async (req: RequestWithBody<{ code: string }>, res: Response) => {
    const confirm = await authService.confirmEmail(req.body.code)
    if (confirm) {
        return res.sendStatus(204)
    } else {
        return res.status(400).send({ errorsMessages: [{ message: "Slomalsya", field: "code" }] })
    }
})

authRoute.get('/me', bearerAuth, async (req: Request, res: Response) => {
    const auth = req.headers['authorization']

    if (!auth) {
        return res.sendStatus(401)
    }
    const accessToken = auth.split(' ')[1]

    const verifyToken = await jwtService.verifyAndDecodeAccessToken(accessToken);

    if (!verifyToken) {
        return res.sendStatus(401);

    }

    const userData = await UsersRepository.findUserById(verifyToken.userId)

    if (!userData) {
        return res.sendStatus(401)
    }

    return res.status(200).send({ userId: userData.id, login: userData.login, email: userData.email })
})

