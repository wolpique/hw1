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
exports.commentsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
const mappers_1 = require("../models/comments/mappers/mappers");
class commentsRepository {
    static getCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield db_1.commentCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!comment) {
                return null;
            }
            return (0, mappers_1.commentmapper)(comment);
        });
    }
    static createComment(createdComment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield db_1.commentCollection.insertOne(Object.assign({}, createdComment));
                return comment.insertedId.toString();
            }
            catch (_a) {
                return null;
            }
        });
    }
    static updateCommentById(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield db_1.commentCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $set: {
                    content: updateData.content
                }
            });
            return !!comment.matchedCount;
        });
    }
    static deleteCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield db_1.commentCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return !!comment.deletedCount;
        });
    }
}
exports.commentsRepository = commentsRepository;
