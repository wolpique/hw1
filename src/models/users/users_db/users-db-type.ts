import { ObjectId } from "mongodb"
import { EmailConfirmationType } from "../../email/email_db"
import { TokensDBType } from "../../tokens/token_db/tokens-db-type"

export type UsersDBType = {
    _id: ObjectId,
    accountData: {
        login: string,
        email: string,
        password: string,
        createdAt: string
    }
    emailConfirmation: EmailConfirmationType,
    rToken: TokensDBType


}