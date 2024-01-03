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
class PostRepository {
    static getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield db_1.postCollection.find({}).toArray();
            return posts.map(mappers_1.postMapper);
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
