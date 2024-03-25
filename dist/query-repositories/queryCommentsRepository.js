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
exports.QueryCommentsRepository = void 0;
const mongodb_1 = require("mongodb");
const comments_schema_1 = require("../domain/schemas/comments.schema");
const mappers_1 = require("../models/comments/mappers/mappers");
class QueryCommentsRepository {
    static getCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comments_schema_1.CommentsModelClass.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!comment) {
                return null;
            }
            return (0, mappers_1.commentmapper)(comment);
        });
    }
}
exports.QueryCommentsRepository = QueryCommentsRepository;
