import { DevicesDBType } from "../device_db/devices_db"
import { OutputDeviceType } from "../output/output.device"


export const deviceMapper = (deviceDb: DevicesDBType): OutputDeviceType => {
    return {
        ip: deviceDb.ip,
        title: deviceDb.title,
        lastActiveDate: deviceDb.lastActiveDate,
        deviceId: deviceDb.deviceId
    }
}