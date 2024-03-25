import mongoose from 'mongoose'
import { AuthMongoDbType } from '../../types'

const authSchema = new mongoose.Schema<AuthMongoDbType>({
    loginOrEmail: { type: String, required: true },
    password: { type: String, required: true },

})

export const AuthModelClass = mongoose.model('auth', authSchema)
