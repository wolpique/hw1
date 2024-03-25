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
exports.testingRoutes = void 0;
const express_1 = require("express");
const users_schema_1 = require("../domain/schemas/users.schema");
const blogs_schema_1 = require("../domain/schemas/blogs.schema");
const posts_schema_1 = require("../domain/schemas/posts.schema");
const device_schema_1 = require("../domain/schemas/device.schema");
exports.testingRoutes = (0, express_1.Router)({});
exports.testingRoutes.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //await database.dropDatabase()
    yield users_schema_1.UsersModelClass.deleteMany({});
    yield blogs_schema_1.BlogsModelClass.deleteMany({});
    yield posts_schema_1.PostsModelClass.deleteMany({});
    yield device_schema_1.DevicesModelClass.deleteMany({});
    return res.sendStatus(204);
}));
