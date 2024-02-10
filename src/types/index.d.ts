import { UsersDBType } from "../../../src/models/users/users_db/users-db-type";

declare global {
    declare namespace Express {
        export interface Request {
            user: UsersDBType | null
        }
    }
}