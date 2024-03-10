import bcrypt from 'bcrypt'
import { ObjectId, UUID } from 'mongodb'
import { UsersRepository } from '../repositories/users-repository'
import { add } from 'date-fns/add'
import { emailsManager } from '../managers/email-manager'
import { UsersDBType } from '../models/users/users_db/users-db-type'
import { randomUUID } from 'crypto'
import { jwtService } from './jwt-service'
import { cookieService } from '../application/cookies'
import { DevicesRepository } from '../repositories/device-repository'
import { devicesCollection } from '../db/db'


export const authService = {
    async createUser(login: string, email: string, password: string): Promise<ObjectId | null> {
        try {
            const passwordHash = await bcrypt.hash(password, 10)
            const code = randomUUID()
            const user: UsersDBType = {
                _id: new ObjectId(),
                accountData: {
                    login,
                    email,
                    password: passwordHash,
                    createdAt: new Date().toISOString(),
                },
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
            await emailsManager.sendPasswordRecoveryMessage(email, code)
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
            await emailsManager.sendPasswordRecoveryMessage(email, code) //null
            return true
        } catch (error) {
            console.error('Error resending email:', error);
            return null; // Return null in case of error
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

        const decoded = await jwtService.verifyAndDecodeRefreshToken(refreshToken)


        //console.log('accessToken', accessToken, 'refreshToken', refreshToken, 'newdeviceId', newdeviceId, 'decoded', decoded, 'user_id', user_id)
        return { accessToken, refreshToken, newdeviceId, decoded, user_id }

    }
}
