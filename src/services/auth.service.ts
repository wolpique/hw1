import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { UsersRepository } from '../repositories/users-repository'
import { add } from 'date-fns/add'
import { emailsManager } from '../managers/email-manager'
import { UsersDBType } from '../models/users/users_db/users-db-type'
import { randomUUID } from 'crypto'
import { jwtService } from './jwt-service'
import { QueryUsersRepository } from '../query-repositories/queryUsersRepository'
import jwt from 'jsonwebtoken'


export const authService = {
    async createUser(login: string, email: string, password: string): Promise<ObjectId | null> {
        try {
            const passwordHash = await bcrypt.hash(password, 10)
            const code = randomUUID()
            const user: UsersDBType = {
                _id: new ObjectId(),
                login,
                email,
                password: passwordHash,
                createdAt: new Date().toISOString(),
                emailConfirmation: {
                    code,
                    expirationDate: add(new Date(), {
                        hours: 1,
                        minutes: 3
                    }),
                    isConfirmed: false,
                },
            }

            const createResult = UsersRepository.createUser(user)
            await emailsManager.sendRegistrationRecoveryMessage(email, code)
            return createResult
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    },

    async emailResending(email: string): Promise<boolean | null> {
        try {
            const confirmData = await UsersRepository.findByLoginOrEmail(email) //null
            if (!confirmData) {
                console.error('User not found for email:', email)
                return null
            }
            if (confirmData.emailConfirmation.isConfirmed === true) {
                return false
            }
            const code = randomUUID()
            const newConfirmationData: UsersDBType = {
                ...confirmData,
                emailConfirmation: {
                    isConfirmed: false,
                    code: code,
                    expirationDate: add(new Date(), {
                        minutes: 5
                    })
                },
            }
            await UsersRepository.updateEmailConfirmation(email, newConfirmationData)
            await emailsManager.sendRegistrationRecoveryMessage(email, code)
            return true
        } catch (error) {
            console.error('Error resending email:', error);
            return null;
        }
    },
    async emailResendingPassword(email: string): Promise<boolean | null> {
        try {
            const user = await UsersRepository.findByLoginOrEmail(email)
            if (!user) {
                console.error('User not found for email:', email)
                return null
            }

            const passwordCode = jwt.sign({ user: user.id }, process.env.TOKEN_SECRET!, { expiresIn: '30m' })

            await emailsManager.sendPasswordRecoveryMessage(email, passwordCode)
            return true
        } catch (error) {
            console.error('Error while resending password:', error);
            return true;
        }
    },

    async confirmPassword(newPassword: string, recoveryCode: string): Promise<boolean> {

        try {
            const payload: any = jwt.verify(recoveryCode, process.env.TOKEN_SECRET!)


            const userId = payload.userId
            const checkUser = await QueryUsersRepository.findUserById(userId)
            if (!checkUser) {
                return false
            }
            const passwordHash = await bcrypt.hash(newPassword, 10)
            await UsersRepository.updatePassword(userId, passwordHash)
            return true
        } catch (error) {
            console.error('Error confirming password:', error);
            return false;
        }

    },

    async confirmEmail(code: string): Promise<boolean> {
        let user = await UsersRepository.findUserByConfirmationCode(code)
        if (!user) {
            return false
        }
        if (user.emailConfirmation.isConfirmed === true) {
            return false
        }
        if (user.emailConfirmation.expirationDate < new Date()) {
            return false
        }
        let result = await UsersRepository.updateConfirmation(user._id)

        return result
    },

    async loginUser(user: UsersDBType) {

        const user_id = user!._id.toString()

        const newdeviceId = new ObjectId().toString() //30-41 auth service method login? return AT RT

        const accessToken = await jwtService.generateAccessToken(user_id)

        const refreshToken = await jwtService.generateAndStoreRefreshToken(user_id, newdeviceId)

        const decoded = await jwtService.decodeRefreshToken(refreshToken)

        return { accessToken, refreshToken, newdeviceId, decoded, user_id }

    },
    async meInfo(userId: string) {

        const user = await QueryUsersRepository.findUserById(userId)
        console.log('user', user)
        const { email, login, id } = user!
        return {
            email: email,
            login: login,
            userId: id
        }


    },

}
