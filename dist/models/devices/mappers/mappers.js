"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceMapper = void 0;
const deviceMapper = (deviceDb) => {
    return {
        ip: deviceDb.ip,
        title: deviceDb.title,
        lastActiveDate: deviceDb.lastActiveDate,
        deviceId: deviceDb.deviceId
    };
};
exports.deviceMapper = deviceMapper;
