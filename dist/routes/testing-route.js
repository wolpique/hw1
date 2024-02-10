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
const db_1 = require("../db/db");
exports.testingRoutes = (0, express_1.Router)({});
exports.testingRoutes.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //await database.dropDatabase()
    yield db_1.usersCollection.deleteMany({});
    yield db_1.blogCollection.deleteMany({});
    yield db_1.postCollection.deleteMany({});
    return res.sendStatus(204);
}));
