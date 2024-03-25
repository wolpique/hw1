import { ObjectId } from "mongodb"
import { QueryPageUsersInputModel } from "../models/users/input/users.input.query.models"
import { usersMapper } from "../models/users/mappers/mappers"
import { OutputUsersType } from "../models/users/output/users.output.model"
import { OutputPageUsersType } from "../models/users/output/users.output.query.models"
import { UsersModelClass } from "../domain/schemas/users.schema"

export class QueryUsersRepository {


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

        const users = await UsersModelClass
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .lean()

        const totalCount = await UsersModelClass.countDocuments(filter)
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
        const user = await UsersModelClass.findOne({ _id: id_type })

        if (!user) {
            return null
        }
        return usersMapper(user)
    }
}