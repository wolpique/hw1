import mongoose from 'mongoose'
import { RateLimitMongoDbType } from '../../types'

const rateLimitSchema = new mongoose.Schema<RateLimitMongoDbType>({
    IP: { type: String, required: true },
    URL: { type: String, required: true },
    date: { type: Date, required: true },
})

export const RateLimitModelClass = mongoose.model('limits', rateLimitSchema)
