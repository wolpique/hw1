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
exports.blogRoutes = void 0;
const express_1 = require("express");
const blog_repository_1 = require("../repositories/blog-repository");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const blogs_validator_1 = require("../middlewares/validators/blogs-validator");
const mongodb_1 = require("mongodb");
exports.blogRoutes = (0, express_1.Router)({});
exports.blogRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blog_repository_1.BlogRepository.getAllBlogs();
    return res.send(blogs);
}));
exports.blogRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const blog = yield blog_repository_1.BlogRepository.getBlogById(id);
    if (!mongodb_1.ObjectId.isValid(id)) {
        return res.sendStatus(404);
    }
    if (!blog) {
        return res.sendStatus(404);
    }
    return res.send(blog);
}));
exports.blogRoutes.post('/', auth_middleware_1.authMiddleware, (0, blogs_validator_1.blogValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, description, websiteUrl, isMembership } = req.body;
    const newBlog = {
        name,
        description,
        websiteUrl,
        isMembership,
        createdAt: new Date().toISOString()
    };
    const createBlog = yield blog_repository_1.BlogRepository.createBlog(newBlog);
    return res.status(201).send(createBlog);
}));
exports.blogRoutes.put('/:id', auth_middleware_1.authMiddleware, (0, blogs_validator_1.blogValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const blog = yield blog_repository_1.BlogRepository.getBlogById(id);
    if (!mongodb_1.ObjectId.isValid(id)) {
        return res.sendStatus(404);
    }
    if (!blog) {
        return res.sendStatus(404);
    }
    let { name, description, websiteUrl } = req.body;
    const updatedNewBlog = Object.assign(Object.assign({}, blog), { name,
        description,
        websiteUrl });
    const blogIsUpdated = yield blog_repository_1.BlogRepository.updateBlog(id, updatedNewBlog);
    if (!blogIsUpdated) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
exports.blogRoutes.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongodb_1.ObjectId.isValid(id)) {
        return res.sendStatus(404);
    }
    const isDeleted = yield blog_repository_1.BlogRepository.deleteBlogById(id);
    if (!isDeleted) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
