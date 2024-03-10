import { count } from "console";
import { devicesCollection } from "../db/db";
import { DevicesDBType } from "../models/devices/device_db/devices_db";
import { OutputDeviceType } from "../models/devices/output/output.device";

export class DevicesRepository {
    static async getAllDevicesByUser(userId: string): Promise<OutputDeviceType[]> {
        const devices = await devicesCollection
            .find({ userId })
            .toArray();

        const mappedDevices: OutputDeviceType[] = devices.map((device: DevicesDBType) => {
            const { _id, userId, refreshTokenSignature, ...outputDevice } = device;
            return outputDevice as OutputDeviceType;
        })

        return mappedDevices
    }

    static async findDeviceIdByUser(deviceId: string): Promise<DevicesDBType | null> {
        const device = devicesCollection.findOne({ deviceId })
        return device
    }

    static async deleteAllDevicesExceptCurrent(userId: string, deviceId: string) {
        const deleted = await devicesCollection
            .deleteMany({
                userId,
                deviceId: { $ne: deviceId }
            })
        return deleted.deletedCount > 0

    }

    static async deleteDeviceById(userId: string, deviceId: string) {
        const deleted = await devicesCollection.deleteOne({ userId, deviceId })
        return deleted.deletedCount > 0;

    }

    static async insertNewSession(userId: string, ip: string, title: string, lastActiveDate: string, deviceId: string, refreshTokenSignature: string) {

        const session = await devicesCollection.insertOne({
            ip,
            title,
            lastActiveDate,
            deviceId,
            userId,
            refreshTokenSignature
        })
        return session
    }

    // static async getLastActiveDate(userId: string, deviceId: string) {
    //     const activeDate = await devicesCollection.findOne({ userId, deviceId })
    //     if (activeDate) {
    //         return activeDate.lastActiveDate
    //     } else {
    //         return null
    //     }
    // }

    static async updateLastActiveDate(userId: string): Promise<boolean> {
        const currentDate = (new Date()).toISOString();
        const update = await devicesCollection.updateOne({ userId }, { $set: { lastActiveDate: currentDate } })
        if (update.modifiedCount === 0) {
            return false
        } else {
            return true

        }
    }
}