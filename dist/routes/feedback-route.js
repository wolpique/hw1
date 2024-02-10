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
exports.feedbacksRoute = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
exports.feedbacksRoute = (0, express_1.Router)({});
exports.feedbacksRoute.post('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newProduct = yield feedbacksService.sendFeedback(req.body.comment, req.userId._id);
    return res.status(201).send(newProduct);
}));
exports.feedbacksRoute.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield feedbacksService.getAllFeedbacks();
    return res.send(users);
}));
