import { Router, Request, Response } from "express";
import { RequestWithBody, RequestWithParams } from "../models/common/common";
import { authLoginValidation, authRegistrationValidation, codeValidationMiddleware, emailValidationMiddleware } from "../middlewares/validators/auth-validator";
import { usersService } from "../services/users.service";
import { AuthLoginModel } from "../models/auth/auth-model/auth-login-models";
import { UsersRepository } from "../repositories/users-repository";
import { jwtService } from "../application/jwt-service";
import { bearerAuth } from "../middlewares/auth/auth-middleware";
import { ObjectId } from "mongodb";
import { authService } from "../services/auth.service";
import { UserInputModel } from "../models/users/input/user-input-mode";
import { cookieService } from "../application/cookies";
import { InvalidatedProjectKind } from "typescript";

export const authRoute = Router({})


authRoute.post('/login', authLoginValidation(), async (req: RequestWithBody<AuthLoginModel>, res: Response) => {
    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

    if (user) {
        const accessToken = await jwtService.generateAccessToken(user)

        const refreshToken = await jwtService.generateRefreshToken(user)

        await cookieService.setRefreshTokenCookie(res, refreshToken)

        return res.send({ accessToken: accessToken, user: user })

    } else {
        return res.sendStatus(401)
    }
})

authRoute.post('/refresh-token', async (req: RequestWithBody<{ refreshToken: string }>, res: Response) => {
    const requestToken = req.cookies.refreshToken


    if (!requestToken) {
        return res.status(401).send('Access Denied. No refresh token provided.')
    }
    try {
        const isInvalidToken = await InvalidRefreshToken.exists({ token: requestToken })
        if (isInvalidToken) {
            return res.status(401).send('Access Denied. No refresh token provided')
        }
        const decoded = await jwtService.verifyRefreshToken(requestToken)

        const user = await usersService.findUserById(decoded.userId);
        if (!user) {
            return res.sendStatus(401);
        }

        const newAccessToken = await jwtService.generateAccessToken(user)
        const newRefreshToken = await jwtService.generateRefreshToken(user);

        cookieService.setRefreshTokenCookie(res, newRefreshToken)
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
        await InvalidRefreshToken.create({ token: refreshToken })
        res.clearCookie('refreshToken')
        return res.sendStatus(204)
    } catch (error) {
        console.error('Error logging out:', error);
        return null
    }

})

authRoute.post('/registration', /*limitRequestMiddleware,*/ authRegistrationValidation(), async (req: RequestWithBody<UserInputModel>, res: Response) => {
    const { login, email, password } = req.body
    const registrationResult = await authService.createUser(login, email, password)

    if (registrationResult) {
        res.status(204).send('Successfull registration')

    } else {
        res.sendStatus(400)
    }
})

authRoute.post('/registration-email-resending', /*limitRequestMiddleware,*/ emailValidationMiddleware(), async (req: RequestWithBody<{ email: string }>, res: Response) => {
    const resend = await authService.emailResending(req.body.email)
    if (!resend) {
        return res.status(400).send({ errorsMessages: [{ message: "Slomalsya", field: "email" }] })
    } else {
        return res.status(204).send("Success")
    }
})

authRoute.post('/registration-confirmation', /*limitRequestMiddleware,*/ codeValidationMiddleware(), async (req: RequestWithBody<{ code: string }>, res: Response) => {
    const confirm = await authService.confirmEmail(req.body.code)
    if (confirm) {
        return res.sendStatus(204)
    } else {
        return res.status(400).send({ errorsMessages: [{ message: "Slomalsya", field: "code" }] })
    }
})

authRoute.get('/me', bearerAuth, async (req: Request, res: Response) => {
    const id = req.params.id

    const userData = await UsersRepository.findUserById(new ObjectId(id))

    if (!userData) {
        return res.sendStatus(401)
    }

    return res.sendStatus(200)
})
