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
exports.commentsRoute = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const comments_repository_1 = require("../repositories/comments-repository");
const comments_validator_1 = require("../middlewares/validators/comments-validator");
const mongodb_1 = require("mongodb");
exports.commentsRoute = (0, express_1.Router)({});
exports.commentsRoute.put('/:id', auth_middleware_1.bearerAuth, (0, comments_validator_1.commentValidator)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    const { id } = req.user;
    if (!mongodb_1.ObjectId.isValid(commentId)) {
        return res.sendStatus(404);
    }
    let { content } = req.body;
    const comment = yield comments_repository_1.commentsRepository.getCommentById(commentId);
    if (!comment) {
        return res.sendStatus(404);
    }
    if (comment.commentatorInfo.userId !== id) {
        res.sendStatus(403);
        return;
    }
    const updatedData = Object.assign(Object.assign({}, comment), { content });
    const isUpdated = yield comments_repository_1.commentsRepository.updateCommentById(commentId, updatedData);
    if (!isUpdated) {
        res.sendStatus(404);
        return;
    }
    return res.sendStatus(204);
}));
exports.commentsRoute.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    const comment = yield comments_repository_1.commentsRepository.getCommentById(commentId);
    if (!comment) {
        return res.sendStatus(404);
    }
    return res.send(comment);
}));
exports.commentsRoute.delete('/:id', auth_middleware_1.bearerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    const { id } = req.user;
    const comment = yield comments_repository_1.commentsRepository.getCommentById(commentId);
    if (!comment) {
        return res.sendStatus(404);
    }
    if (comment.commentatorInfo.userId !== id) {
        return res.sendStatus(403);
    }
    const isDeleted = yield comments_repository_1.commentsRepository.deleteCommentById(commentId);
    if (!isDeleted) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
