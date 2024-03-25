import { DevicesModelClass } from "../domain/schemas/device.schema";
import { DevicesDBType } from "../models/devices/device_db/devices_db";
import { OutputDeviceType } from "../models/devices/output/output.device";

export class QueryDevicesRepository {
    static async getAllDevicesByUser(userId: string): Promise<OutputDeviceType[]> {
        const devices = await DevicesModelClass
            .find({ userId })
            .lean();

        const mappedDevices: OutputDeviceType[] = devices.map((device: DevicesDBType) => {
            const { _id, userId, refreshTokenSignature, ...outputDevice } = device;
            return outputDevice as OutputDeviceType;
        })

        return mappedDevices
    }
}