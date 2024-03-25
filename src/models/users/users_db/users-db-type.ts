import { ObjectId } from "mongodb"
import { EmailConfirmationType } from "../../email/email_db"

export type UsersDBType = {
    _id: ObjectId,
    login: string,
    email: string,
    password: string,
    createdAt: string,
    emailConfirmation: EmailConfirmationType,

}