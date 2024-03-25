import mongoose from 'mongoose'
import { emailConfirmationSchema } from "./emailConfirmation.schema"
import { UsersMongoDbType } from '../../types'


const usersSchema = new mongoose.Schema<UsersMongoDbType>({
    login: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: String, required: true },
    emailConfirmation: { type: emailConfirmationSchema, required: true },
})

export const UsersModelClass = mongoose.model('users', usersSchema)
