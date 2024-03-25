import mongoose from 'mongoose'
import { emailConfirmationMongoDbType } from '../../types'

export const emailConfirmationSchema = new mongoose.Schema<emailConfirmationMongoDbType>({
    isConfirmed: { type: Boolean, required: true },
    code: { type: String, required: true },
    expirationDate: { type: Date, required: true },
})

export const emailConfirmationModelClass = mongoose.model('emails', emailConfirmationSchema)
