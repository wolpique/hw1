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
const comments_schema_1 = require("../domain/schemas/comments.schema");
class commentsRepository {
    static createComment(createdComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = new comments_schema_1.CommentsModelClass(Object.assign({}, createdComment));
            yield newComment.save();
            return newComment.toObject();
        });
    }
    static updateCommentById(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentToUpdate = yield comments_schema_1.CommentsModelClass.findOneAndUpdate({ _id: id }, { $set: updateData });
            if (!commentToUpdate) {
                return false;
            }
            return true;
        });
    }
    static deleteCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comments_schema_1.CommentsModelClass.findOneAndDelete({ _id: id });
            return !!result;
        });
    }
}
exports.commentsRepository = commentsRepository;
