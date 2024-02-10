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
exports.PostRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
const mappers_1 = require("../models/post/mappers/mappers");
const mappers_postcomment_1 = require("../models/post/mappers/mappers.postcomment");
class PostRepository {
    static getAllPosts(sortData) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const pageNumber = (_a = sortData.pageNumber) !== null && _a !== void 0 ? _a : 1;
            const pageSize = (_b = sortData.pageSize) !== null && _b !== void 0 ? _b : 10;
            const sortBy = (_c = sortData.sortBy) !== null && _c !== void 0 ? _c : 'createdAt';
            const sortDirection = (_d = sortData.sortDirection) !== null && _d !== void 0 ? _d : 'desc';
            const posts = yield db_1.postCollection
                .find({})
                .sort(sortBy, sortDirection)
                .skip((+pageNumber - 1) * +pageSize)
                .limit(+pageSize)
                .toArray();
            const totalCount = yield db_1.postCollection.countDocuments();
            const pagesCount = Math.ceil(totalCount / +pageSize);
            return {
                pagesCount,
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount,
                items: posts.map(mappers_1.postMapper)
            };
        });
    }
    static getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!post) {
                return null;
            }
            return (0, mappers_1.postMapper)(post);
        });
    }
    static getCommentById(postId, sortData) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const sortBy = (_a = sortData.sortBy) !== null && _a !== void 0 ? _a : 'createdAt';
            const sortDirection = (_b = sortData.sortDirection) !== null && _b !== void 0 ? _b : 'desc';
            const pageNumber = (_c = sortData.pageNumber) !== null && _c !== void 0 ? _c : 1;
            const pageSize = (_d = sortData.pageSize) !== null && _d !== void 0 ? _d : 10;
            const posts = yield db_1.commentCollection
                .find({ postId: postId })
                .sort(sortBy, sortDirection)
                .skip((+pageNumber - 1) * +pageSize)
                .limit(+pageSize)
                .toArray();
            const totalCount = yield db_1.commentCollection
                .countDocuments({ postId: postId });
            const pagesCount = Math.ceil(totalCount / +pageSize);
            return {
                pagesCount,
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount,
                items: posts.map(mappers_postcomment_1.postCommentMapper)
            };
        });
    }
    static createPost(createdPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postCollection.insertOne(Object.assign({}, createdPost));
            return Object.assign(Object.assign({}, createdPost), { id: post.insertedId.toString() });
        });
    }
    static updatePost(id, updatedPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $set: {
                    title: updatedPost.title,
                    shortDescription: updatedPost.shortDescription,
                    content: updatedPost.content,
                    blogId: updatedPost.blogId
                }
            });
            return !!post.matchedCount;
        });
    }
    static deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return !!post.deletedCount;
        });
    }
}
exports.PostRepository = PostRepository;
