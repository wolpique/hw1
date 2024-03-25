"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsModelClass = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const blogsSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    isMembership: { type: Boolean },
    createdAt: { type: String }
});
exports.BlogsModelClass = mongoose_1.default.model('blogs', blogsSchema);
