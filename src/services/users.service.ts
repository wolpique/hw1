import bcrypt from 'bcrypt'
import { UsersDBType } from '../models/users/users_db/users-db-type'
import { UsersRepository } from '../repositories/users-repository'
import { ObjectId } from 'mongodb'
import { OutputUsersType } from '../models/users/output/users.output.model'
import { randomUUID } from 'crypto'
import { QueryUsersRepository } from '../query-repositories/queryUsersRepository'

export const usersService = {
    async addNewUsers(login: string, email: string, password: string): Promise<OutputUsersType> {
        const passwordHash = await bcrypt.hash(password, 10) //passwordSalt

        const newUser: UsersDBType = {
            _id: new ObjectId(),
            login,
            email,
            password: passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                isConfirmed: true,
                code: randomUUID(),
                expirationDate: new Date()
            },
        }

        return UsersRepository.addNewUsers(newUser)
    },

    async findUserById(id: string): Promise<OutputUsersType | null> {
        return QueryUsersRepository.findUserById(id)
    },

    async findUserByRefreshToken(refreshToken: string) {
        return UsersRepository.findUserByRefreshToken(refreshToken)
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await UsersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return null
        }

        const checkResult = await bcrypt.compare(password, user.password) //rename pass2
        console.log('checkResult', checkResult)
        if (!checkResult) {
            return null
        }
        return user
    },

}