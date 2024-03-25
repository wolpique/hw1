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
const mongodb_1 = require("mongodb");
const blogs_schema_1 = require("../domain/schemas/blogs.schema");
const mappers_1 = require("../models/blog/mappers/mappers");
class BlogRepository {
    static createBlog(createdBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = new blogs_schema_1.BlogsModelClass(createdBlog);
            yield newBlog.save();
            return newBlog.toObject();
        });
    }
    static updateBlog(id, updatedBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogInstance = yield blogs_schema_1.BlogsModelClass.findOne({ _id: id });
            if (!blogInstance)
                return false;
            blogInstance.name = updatedBlog.name,
                blogInstance.description = updatedBlog.description,
                blogInstance.websiteUrl = updatedBlog.websiteUrl,
                blogInstance.isMembership = updatedBlog.isMembership;
            yield blogInstance.save();
            return true;
        });
    }
    static getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_schema_1.BlogsModelClass.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!blog) {
                return null;
            }
            return (0, mappers_1.blogMapper)(blog);
        });
    }
    static deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogInstance = yield blogs_schema_1.BlogsModelClass.findOne({ _id: id });
            if (!blogInstance)
                return false;
            yield blogInstance.deleteOne();
            return true;
        });
    }
}
exports.BlogRepository = BlogRepository;
