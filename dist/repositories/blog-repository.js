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
exports.BlogRepository = void 0;
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
const mappers_1 = require("../models/blog/mappers/mappers");
class BlogRepository {
    static getAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield db_1.blogCollection.find({}).toArray();
            return blogs.map(mappers_1.blogMapper);
        });
    }
    static getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!blog) {
                return null;
            }
            return (0, mappers_1.blogMapper)(blog);
        });
    }
    static createBlog(createdBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogCollection.insertOne(createdBlog);
            return Object.assign(Object.assign({}, createdBlog), { id: blog.insertedId.toString(), createdAt: new Date().toISOString(), isMembership: false });
        });
    }
    static updateBlog(id, updatedBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $set: {
                    name: updatedBlog.name,
                    description: updatedBlog.description,
                    websiteUrl: updatedBlog.websiteUrl
                }
            });
            return !!blog.matchedCount;
        });
    }
    static deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return !!blog.deletedCount;
        });
    }
}
exports.BlogRepository = BlogRepository;
