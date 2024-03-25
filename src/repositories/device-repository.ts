import { DevicesDBType } from "../models/devices/device_db/devices_db";
import { DevicesModelClass } from "../domain/schemas/device.schema";

export class DevicesRepository {

    static async findDeviceIdByUser(deviceId: string): Promise<DevicesDBType | null> {
        const device = DevicesModelClass.findOne({ deviceId })
        return device
    }

    static async deleteAllDevicesExceptCurrent(userId: string, deviceId: string) {
        const deleted = await DevicesModelClass
            .deleteMany({
                userId,
                deviceId: { $ne: deviceId }
            })
        return deleted.deletedCount > 0

    }

    static async deleteDeviceById(userId: string, deviceId: string) {
        const deleted = await DevicesModelClass.deleteOne({ userId, deviceId })
        return deleted.deletedCount > 0;

    }

    static async insertNewSession(userId: string, ip: string, title: string, lastActiveDate: string, deviceId: string, refreshTokenSignature: string) {

        const session = await DevicesModelClass.create({
            ip,
            title,
            lastActiveDate,
            deviceId,
            userId,
            refreshTokenSignature
        })
        return session
    }

    static async updateLastActiveDate(userId: string): Promise<boolean> {
        const currentDate = (new Date()).toISOString();
        const update = await DevicesModelClass.updateOne({ userId }, { $set: { lastActiveDate: currentDate } })
        if (update.modifiedCount === 0) {
            return false
        } else {
            return true

        }
    }
}