"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesModelClass = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const devicesSchema = new mongoose_1.default.Schema({
    ip: { type: String, required: true },
    title: { type: String, required: true },
    lastActiveDate: { type: String, required: true },
    deviceId: { type: String, required: true },
    userId: { type: String, required: true },
    refreshTokenSignature: { type: String, required: true },
});
exports.DevicesModelClass = mongoose_1.default.model('devices', devicesSchema);
