import { ObjectId } from "mongodb"

export type DevicesDBType = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string,
    userId: string,
    refreshTokenSignature: string
    _id?: ObjectId
}