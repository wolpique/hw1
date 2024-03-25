"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesRepository = void 0;
const device_schema_1 = require("../domain/schemas/device.schema");
class DevicesRepository {
    static findDeviceIdByUser(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = device_schema_1.DevicesModelClass.findOne({ deviceId });
            return device;
        });
    }
    static deleteAllDevicesExceptCurrent(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield device_schema_1.DevicesModelClass
                .deleteMany({
                userId,
                deviceId: { $ne: deviceId }
            });
            return deleted.deletedCount > 0;
        });
    }
    static deleteDeviceById(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield device_schema_1.DevicesModelClass.deleteOne({ userId, deviceId });
            return deleted.deletedCount > 0;
        });
    }
    static insertNewSession(userId, ip, title, lastActiveDate, deviceId, refreshTokenSignature) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield device_schema_1.DevicesModelClass.create({
                ip,
                title,
                lastActiveDate,
                deviceId,
                userId,
                refreshTokenSignature
            });
            return session;
        });
    }
    static updateLastActiveDate(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = (new Date()).toISOString();
            const update = yield device_schema_1.DevicesModelClass.updateOne({ userId }, { $set: { lastActiveDate: currentDate } });
            if (update.modifiedCount === 0) {
                return false;
            }
            else {
                return true;
            }
        });
    }
}
exports.DevicesRepository = DevicesRepository;
