"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModelClass = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const authSchema = new mongoose_1.default.Schema({
    loginOrEmail: { type: String, required: true },
    password: { type: String, required: true },
});
exports.AuthModelClass = mongoose_1.default.model('auth', authSchema);
