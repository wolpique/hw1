"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRoutes = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
exports.testingRoutes = (0, express_1.Router)({});
exports.testingRoutes.delete('/all-data', (req, res) => {
    db_1.db.blogs.length = 0;
    return res.sendStatus(204);
});
