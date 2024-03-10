import { UsersDBType } from "../users_db/users-db-type.js"
import { OutputUsersType } from "../output/users.output.model"


export const usersMapper = (usersDb: UsersDBType): OutputUsersType => {
    return {
        id: usersDb._id.toString(),
        login: usersDb.accountData.login,
        email: usersDb.accountData.email,
        createdAt: usersDb.accountData.createdAt
    }
}