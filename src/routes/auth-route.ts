import { Router, Request, Response } from "express";
import { RequestWithBody } from "../models/common/common";
import { authLoginValidation, authRegistrationValidation, codeValidationMiddleware, emailPasswordValidationMiddleware, emailValidationMiddleware, newPasswordValidationMiddleware, passwordValidationMiddleware } from "../middlewares/validators/auth-validator";
import { usersService } from "../services/users.service";
import { AuthLoginModel } from "../models/auth/auth-model/auth-login-models";
import { jwtService } from "../services/jwt-service";
import { bearerAuth } from "../middlewares/auth/auth-middleware";
import { authService } from "../services/auth.service";
import { UserInputModel } from "../models/users/input/user-input-mode";
import { cookieService } from "../application/cookies";
import { limitRequestMiddleware } from "../middlewares/auth/limit-requests";
import { DevicesRepository } from "../repositories/device-repository";
import { authRefreshTokenBearerValidator } from "../middlewares/validators/refreshToken-validator";
import { UsersRepository } from "../repositories/users-repository";


export const authRoute = Router({})


authRoute.post('/login', limitRequestMiddleware, authLoginValidation(), async (req: RequestWithBody<AuthLoginModel>, res: Response) => {

    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    console.log('useruseruser', user)

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

authRoute.post('/logout', authRefreshTokenBearerValidator, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    try {

        const decoded = await jwtService.decodeRefreshToken(refreshToken)
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

authRoute.post('/refresh-token', authRefreshTokenBearerValidator, async (req: Request, res: Response) => {

    try {
        const userId = req.user.id
        const user = await usersService.findUserById(userId)

        console.log('userId', userId)

        const update = await DevicesRepository.updateLastActiveDate(userId);
        console.log('update', update)
        if (update == false) {
            return res.status(401).send('LastActiveDate is invalid.')
        }

        const newAccessToken = await jwtService.generateAccessToken(userId)
        console.log('newAccessToken', newAccessToken)

        const newRefreshToken = await jwtService.generateAndStoreRefreshToken(userId, userId.deviceId); //в ауз сервис
        console.log('newRefreshToken', newRefreshToken)


        await cookieService.setRefreshTokenCookie(res, newRefreshToken)
        return res.send({ accessToken: newAccessToken })
    } catch (error) {
        console.log("error", error)
        return res.sendStatus(401)
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
    console.log('THIS IS RESEND', resend);
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

authRoute.post('/password-recovery', limitRequestMiddleware, emailPasswordValidationMiddleware(), async (req: RequestWithBody<{ email: string }>, res: Response) => {
    const email = req.body.email
    console.log('EMAIL', email)
    const registered = await UsersRepository.findByEmail(email)
    if (!registered) {
        return res.sendStatus(204)
    }
    const resend = await authService.emailResendingPassword(email)

    return res.sendStatus(204)

})

authRoute.post('/new-password', limitRequestMiddleware, newPasswordValidationMiddleware(), async (req: RequestWithBody<{ newPassword: string, recoveryCode: string }>, res: Response) => {
    const newPassword = req.body.newPassword
    const recoveryCode = req.body.recoveryCode
    console.log('recoveryCode', recoveryCode)
    const confirm = await authService.confirmPassword(newPassword, recoveryCode)
    console.log('confirm', confirm)

    if (!confirm) {
        return res.status(400).send({ errorsMessages: [{ message: 'Incoect', field: "recoveryCode" }] })
    }
    return res.status(204).send();

})

authRoute.get('/me', bearerAuth, async (req: Request, res: Response) => {
    const userId: string = req.user!.id
    console.log("userId", userId)
    const result = await authService.meInfo(userId)
    console.log("result", result)

    return res.status(200).send(result)
})


