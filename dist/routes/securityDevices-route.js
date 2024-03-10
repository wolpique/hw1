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
exports.securityDeviceRoute = void 0;
const express_1 = require("express");
const users_repository_1 = require("../repositories/users-repository");
const jwt_service_1 = require("../services/jwt-service");
const device_repository_1 = require("../repositories/device-repository");
exports.securityDeviceRoute = (0, express_1.Router)({});
exports.securityDeviceRoute.get('/devices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res
            .status(401)
            .send('Refresh token is not found');
    }
    const decodedToken = yield jwt_service_1.jwtService.verifyAndDecodeRefreshToken(refreshToken);
    if (!decodedToken) {
        return res
            .status(401)
            .send('Invalid token!');
    }
    const user = yield users_repository_1.UsersRepository.findUserById(decodedToken.userId);
    if (!user) {
        return res
            .status(401)
            .send('User is not found');
    }
    const devices = yield device_repository_1.DevicesRepository.getAllDevicesByUser(decodedToken.userId);
    if (!devices) {
        return res.sendStatus(401);
    }
    else {
        return res.status(200).send(devices);
    }
}));
exports.securityDeviceRoute.delete('/devices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res
            .status(401)
            .send('Refresh token is not found');
    }
    const decodedToken = yield jwt_service_1.jwtService.verifyAndDecodeRefreshToken(refreshToken);
    if (!decodedToken) {
        return res
            .status(401)
            .send('Invalid token!');
    }
    const deleteDevices = yield device_repository_1.DevicesRepository.deleteAllDevicesExceptCurrent(decodedToken.userId, decodedToken.deviceId);
    if (deleteDevices == true) {
        return res.status(204).send('Device');
    }
    else {
        return res.status(500).send('Error');
    }
}));
exports.securityDeviceRoute.delete('/devices/:deviceId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const deviceId = req.params.deviceId;
    if (!refreshToken) {
        return res
            .status(401)
            .send('Refresh token is not found');
    }
    if (!deviceId) {
        return res
            .status(401)
            .send('DeviceID token is not found');
    }
    const decodedToken = yield jwt_service_1.jwtService.verifyAndDecodeRefreshToken(refreshToken);
    const check = yield jwt_service_1.jwtService.checkValidityOfToken(decodedToken.userId, decodedToken.deviceId, refreshToken);
    if (check == false) {
        return res.status(401).send('Access Denied. Invalid refresh token provided.');
    }
    if (!decodedToken) {
        return res
            .status(401)
            .send('Invalid token!');
    }
    const device = yield device_repository_1.DevicesRepository.findDeviceIdByUser(deviceId);
    console.log('device', device);
    if (!device) {
        return res
            .status(404)
            .send('Device is not found');
    }
    if (decodedToken.userId !== device.userId) {
        return res
            .status(403)
            .send('Device is not yours');
    }
    const deleted = yield device_repository_1.DevicesRepository.deleteDeviceById(decodedToken.userId, deviceId);
    if (deleted == false) {
        return res.status(500).send('Error');
    }
    return res.sendStatus(204);
}));
