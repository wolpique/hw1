import { UsersDBType } from "../users_db/users-db-type.js"
import { OutputUsersType } from "../output/users.output.model"


export const usersMapper = (usersDb: UsersDBType): OutputUsersType => {
    return {
        id: usersDb._id.toString(),
        login: usersDb.login,
        email: usersDb.email,
        createdAt: usersDb.createdAt
    }
}