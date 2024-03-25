"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailConfirmationModelClass = exports.emailConfirmationSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.emailConfirmationSchema = new mongoose_1.default.Schema({
    isConfirmed: { type: Boolean, required: true },
    code: { type: String, required: true },
    expirationDate: { type: Date, required: true },
});
exports.emailConfirmationModelClass = mongoose_1.default.model('emails', exports.emailConfirmationSchema);
