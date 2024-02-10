import bcrypt from 'bcrypt'
import { ObjectId, UUID } from 'mongodb'
import { UsersRepository } from '../repositories/users-repository'
import { add } from 'date-fns/add'
import { emailsManager } from '../managers/email-manager'
import { UsersDBType } from '../models/users/users_db/users-db-type'
import { randomUUID } from 'crypto'

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
                rToken: {
                    refreshToken: randomUUID(),
                }
            }

            const createResult = UsersRepository.createUser(user)
            await emailsManager.sendPasswordRecoveryMessage(email, code)
            return createResult
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    },

    // async generateNewToken(refreshToken: string): Promise<boolean | null> {
    //     try {
    //         const user = await UsersRepository.findUserByRefreshToken(refreshToken)
    //         if (!user) {
    //             console.error('User not found for refreshToken:', refreshToken)
    //             return null
    //         }
    //         if (user.rToken < new Date())
    //             const generateRToken = await jwtService.generateRefreshToken(user)

    //         const refreshedToken = await UsersRepository.updateRefreshToken(user._id,
    //             { rToken: { refreshToken: generateRToken } })
    //         return true;
    //     } catch (error) {
    //         console.error('Error generating new token:', error);
    //         return false
    //     }
    // },

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
    },//выравнивать 

    async confirmEmail(code: string): Promise<boolean> {
        let user = await UsersRepository.findUserByConfirmationCode(code)
        console.log("here")
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
    }
}
