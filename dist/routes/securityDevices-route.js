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
const jwt_service_1 = require("../services/jwt-service");
const device_repository_1 = require("../repositories/device-repository");
const queryDevicesRepository_1 = require("../query-repositories/queryDevicesRepository");
const refreshToken_validator_1 = require("../middlewares/validators/refreshToken-validator");
exports.securityDeviceRoute = (0, express_1.Router)({});
exports.securityDeviceRoute.get('/devices', refreshToken_validator_1.authRefreshTokenBearerValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const decodedToken = yield jwt_service_1.jwtService.decodeRefreshToken(refreshToken);
    if (!decodedToken) {
        return res
            .status(401)
            .send('Invalid token!');
    }
    const devices = yield queryDevicesRepository_1.QueryDevicesRepository.getAllDevicesByUser(decodedToken.userId);
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
    const decodedToken = yield jwt_service_1.jwtService.decodeRefreshToken(refreshToken);
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
exports.securityDeviceRoute.delete('/devices/:deviceId', refreshToken_validator_1.authRefreshTokenBearerValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const decodedToken = yield jwt_service_1.jwtService.decodeRefreshToken(refreshToken);
    if (!decodedToken) {
        return res
            .status(401)
            .send('Invalid token!');
    }
    const device = yield device_repository_1.DevicesRepository.findDeviceIdByUser(deviceId);
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
