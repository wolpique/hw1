"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModelClass = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const emailConfirmation_schema_1 = require("./emailConfirmation.schema");
const usersSchema = new mongoose_1.default.Schema({
    login: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: String, required: true },
    emailConfirmation: { type: emailConfirmation_schema_1.emailConfirmationSchema, required: true },
});
exports.UsersModelClass = mongoose_1.default.model('users', usersSchema);
