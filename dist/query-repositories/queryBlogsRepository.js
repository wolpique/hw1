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
exports.QueryBlogRepository = void 0;
const blogs_schema_1 = require("../domain/schemas/blogs.schema");
const mappers_1 = require("../models/blog/mappers/mappers");
const mappers_2 = require("../models/post/mappers/mappers");
const posts_schema_1 = require("../domain/schemas/posts.schema");
const blog_repository_1 = require("../repositories/blog-repository");
class QueryBlogRepository {
    static getAllBlogs(sortData) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const searchNameTerm = (_a = sortData.searchNameTerm) !== null && _a !== void 0 ? _a : null;
            const sortBy = (_b = sortData.sortBy) !== null && _b !== void 0 ? _b : 'createdAt';
            const sortDirection = (_c = sortData.sortDirection) !== null && _c !== void 0 ? _c : 'desc';
            const pageNumber = (_d = sortData.pageNumber) !== null && _d !== void 0 ? _d : 1;
            const pageSize = (_e = sortData.pageSize) !== null && _e !== void 0 ? _e : 10;
            let filter = {};
            if (searchNameTerm) {
                filter = {
                    name: { $regex: searchNameTerm, $options: 'i' }
                };
            }
            const blogs = yield blogs_schema_1.BlogsModelClass
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip((+pageNumber - 1) * +pageSize)
                .limit(+pageSize)
                .lean();
            const totalCount = yield blogs_schema_1.BlogsModelClass.countDocuments(filter);
            const pagesCount = Math.ceil(totalCount / +pageSize);
            return {
                pagesCount,
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount,
                items: blogs.map(mappers_1.blogMapper)
            };
        });
    }
    static createPostToBlog(blogId, postData) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blog_repository_1.BlogRepository.getBlogById(blogId);
            console.log('blog', blog);
            const post = {
                title: postData.title,
                shortDescription: postData.shortDescription,
                content: postData.content,
                blogId: blogId,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            };
            const res = yield posts_schema_1.PostsModelClass.create(post);
            return res._id;
        });
    }
    static getPostsByBlogId(blogId, sortData) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const sortBy = (_a = sortData.sortBy) !== null && _a !== void 0 ? _a : 'createdAt';
            const sortDirection = (_b = sortData.sortDirection) !== null && _b !== void 0 ? _b : 'desc';
            const pageNumber = (_c = sortData.pageNumber) !== null && _c !== void 0 ? _c : 1;
            const pageSize = (_d = sortData.pageSize) !== null && _d !== void 0 ? _d : 10;
            const posts = yield posts_schema_1.PostsModelClass
                .find({ blogId: blogId })
                .sort(sortBy)
                .sort(sortDirection)
                .skip((+pageNumber - 1) * +pageSize)
                .limit(+pageSize)
                .lean();
            const totalCount = yield posts_schema_1.PostsModelClass
                .countDocuments({ blogId: blogId });
            const pagesCount = Math.ceil(totalCount / +pageSize);
            return {
                pagesCount,
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount,
                items: posts.map(mappers_2.postMapper)
            };
        });
    }
}
exports.QueryBlogRepository = QueryBlogRepository;
