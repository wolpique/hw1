import { ObjectId } from "mongodb";
import { usersCollection } from "../db/db";
import { QueryPageUsersInputModel } from "../models/users/input/users.input.query.models";
import { usersMapper } from "../models/users/mappers/mappers";
import { OutputPageUsersType } from "../models/users/output/users.output.query.models";
import { UsersDBType } from "../models/users/users_db/users-db-type";
import { OutputUsersType } from "../models/users/output/users.output.model";
import { EmailResendingType } from "../models/email/email_db";
//import { TokensDBType } from "../models/tokens/token_db/tokens-db-type";

export class UsersRepository {

    static async getAllUsers(sortData: QueryPageUsersInputModel): Promise<OutputPageUsersType> {
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10
        const searchLoginTerm = sortData.searchLoginTerm ?? null
        const searchEmailTerm = sortData.searchEmailTerm ?? null


        type FilterType = {
            $or?: ({
                $regex: string;
                $options: string;
            } | {})[];
        };

        let filter: FilterType = { $or: [] };
        if (searchEmailTerm) {
            filter['$or']?.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
        }
        if (searchLoginTerm) {
            filter['$or']?.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
        }
        if (filter['$or']?.length === 0) {
            filter['$or']?.push({});
        }

        const users = await usersCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await usersCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / +pageSize)

        return {
            pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount,
            items: users.map(usersMapper)
        }
    }

    static async findUserById(id: string): Promise<OutputUsersType | null> {
        const id_type = new ObjectId(id)
        const user = await usersCollection.findOne({ _id: id_type })

        if (!user) {
            return null
        }
        return usersMapper(user)
    }

    static async findUserByRefreshToken(refreshToken: string) {
        const user = await usersCollection.findOne({ 'refreshToken': refreshToken })
        if (!user) {
            return null
        }
        return user
    }

    static async findByLoginOrEmail(loginOrEmail: string) {
        const user = await usersCollection.findOne({ $or: [{ 'accountData.login': loginOrEmail }, { 'accountData.email': loginOrEmail }] })
        return user

    }


    static async updateConfirmation(_id: ObjectId) {
        let result = await usersCollection.updateOne({ _id }, { $set: { 'emailConfirmation.isConfirmed': true } })
        return result.modifiedCount === 1

    }

    static async updateEmailConfirmation(email: string, updated: UsersDBType) {
        let updateEmail = await usersCollection.updateOne({ 'accountData.email': email }, {
            $set: {
                'emailConfirmation.code': updated.emailConfirmation.code,
                'emailConfirmation.expirationDate': updated.emailConfirmation.expirationDate
            }
        })
        return updateEmail.modifiedCount === 1

    }


    static async emailResending(newConfirmationData: EmailResendingType): Promise<boolean> {
        try {
            const result = await usersCollection.updateOne({ email: newConfirmationData.email }, { $set: { emailConfirmation: newConfirmationData } })
            return result.modifiedCount > 0;
        } catch (error) {
            console.error('Error updating confirmation data:', error);
            return false
        }
    }


    static async findUserByConfirmationCode(code: string) {
        const account = await usersCollection.findOne({ 'emailConfirmation.code': code })
        return account

    }

    static async createUser(user: UsersDBType): Promise<ObjectId> {
        const result = await usersCollection.insertOne(user)
        return result.insertedId

    }

    static async addNewUsers(createdUser: UsersDBType): Promise<any> {
        const user = await usersCollection.insertOne({ ...createdUser })

        const newUser = {
            ...createdUser
        }
        return usersMapper(newUser)

    }

    static async deleteUserById(id: string): Promise<boolean> {
        const user = await usersCollection.deleteOne({ _id: new ObjectId(id) }) // id || _id
        return !!user.deletedCount
    }

    // static async updateRefreshToken(id: ObjectId, updated: TokensDBType): Promise<boolean> {
    //     try {
    //         const updateToken = await usersCollection.updateOne({ _id: id }, {
    //             $set: { 'refreshToken': updated.refreshToken }
    //         }
    //         )
    //         return updateToken.modifiedCount > 0;
    //     } catch (error) {
    //         console.error('Error deleting refresh token:', error);
    //         return false
    //     }
    // }


}


//route res req
//repository logic
//service utilities
//servio
