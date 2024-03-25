import mongoose from 'mongoose'
import { DevicesMongoDbType } from '../../types'

const devicesSchema = new mongoose.Schema<DevicesMongoDbType>({
    ip: { type: String, required: true },
    title: { type: String, required: true },
    lastActiveDate: { type: String, required: true },
    deviceId: { type: String, required: true },
    userId: { type: String, required: true },
    refreshTokenSignature: { type: String, required: true },

})

export const DevicesModelClass = mongoose.model('devices', devicesSchema)
