import { ObjectId } from "mongodb";
import { usersMapper } from "../models/users/mappers/mappers";
import { UsersDBType } from "../models/users/users_db/users-db-type";
import { EmailResendingType } from "../models/email/email_db";
import { UsersModelClass } from "../domain/schemas/users.schema";

export class UsersRepository {

    static async findUserByRefreshToken(refreshToken: string) {
        const user = await UsersModelClass.findOne({ 'refreshToken': refreshToken })
        if (!user) {
            return null
        }
        return user
    }

    static async findByLoginOrEmail(loginOrEmail: string) {
        console.log('findByLoginOrEmail')
        const user = await UsersModelClass.findOne({ $or: [{ 'login': loginOrEmail }, { 'email': loginOrEmail }] })
        console.log('user', user)
        if (!user) {
            return null;
        }

        return user
    }

    static async findByEmail(email: string) {
        const user = await UsersModelClass.findOne({ 'email': email })
        console.log('user', user, user?.emailConfirmation.isConfirmed)
        if (!user || user.emailConfirmation.isConfirmed) {
            return null;
        }
        return user
    }


    static async updateConfirmation(_id: ObjectId) {
        let result = await UsersModelClass.updateOne({ _id }, { $set: { 'emailConfirmation.isConfirmed': true } })
        return result.modifiedCount === 1

    }

    static async updatePassword(_id: ObjectId, passwordHash: string) {
        let result = await UsersModelClass.updateOne({ _id }, { $set: { 'password': passwordHash } })
        return result.modifiedCount === 1

    }

    static async updateEmailConfirmation(email: string, updated: UsersDBType) {
        let updateEmail = await UsersModelClass.updateOne({ 'email': email }, {
            $set: {
                'emailConfirmation.code': updated.emailConfirmation.code,
                'emailConfirmation.expirationDate': updated.emailConfirmation.expirationDate
            }
        })
        return updateEmail.modifiedCount === 1

    }


    static async emailResending(newConfirmationData: EmailResendingType): Promise<boolean> {
        try {
            const result = await UsersModelClass.updateOne({ email: newConfirmationData.email }, { $set: { emailConfirmation: newConfirmationData } })
            return result.modifiedCount > 0;
        } catch (error) {
            console.error('Error updating confirmation data:', error);
            return false
        }
    }


    static async findUserByConfirmationCode(code: string) {
        const account = await UsersModelClass.findOne({ 'emailConfirmation.code': code })
        return account

    }

    static async createUser(user: UsersDBType): Promise<ObjectId> {
        const newUser = new UsersModelClass(user)
        await newUser.save()
        return newUser.toObject()

    }

    static async addNewUsers(createdUser: UsersDBType) {
        const user = await UsersModelClass.create({ ...createdUser })

        const newUser = {
            ...createdUser
        }
        return usersMapper(newUser)

    }

    static async deleteUserById(id: string): Promise<boolean> {
        const user = await UsersModelClass.deleteOne({ _id: new ObjectId(id) }) // id || _id
        return !!user.deletedCount
    }
}
