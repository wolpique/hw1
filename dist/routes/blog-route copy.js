"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoutes = void 0;
const express_1 = require("express");
const blog_repository_1 = require("../repositories/blog-repository");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const blogs_validator_1 = require("../validators/blogs-validator");
const db_1 = require("../db/db");
const crypto_1 = require("crypto");
exports.blogRoutes = (0, express_1.Router)({});
exports.blogRoutes.get('/', (req, res) => {
    const blogs = blog_repository_1.BlogRepository.getAllBlogs();
    return res.send(blogs);
});
exports.blogRoutes.get('/:id', auth_middleware_1.authMiddleware, (req, res) => {
    const id = req.params.id;
    const blog = blog_repository_1.BlogRepository.getBlogById(id);
    if (!blog) {
        return res.sendStatus(404);
    }
    return res.send(blog);
});
exports.blogRoutes.post('/', auth_middleware_1.authMiddleware, (0, blogs_validator_1.blogValidation)(), (req, res) => {
    let { name, description, websiteUrl } = req.body;
    const newBlog = {
        id: (0, crypto_1.randomUUID)(),
        name,
        description,
        websiteUrl,
    };
    blog_repository_1.BlogRepository.createBlog(newBlog);
    return res.status(201).send(newBlog);
});
exports.blogRoutes.put('/:id', auth_middleware_1.authMiddleware, (0, blogs_validator_1.blogValidation)(), (req, res) => {
    const id = req.params.id;
    const blog = blog_repository_1.BlogRepository.getBlogById(id);
    if (!blog) {
        return res.sendStatus(404);
    }
    res.send(blog);
    let { name, description, websiteUrl } = req.body;
    const updatedNewBlog = Object.assign(Object.assign({}, blog), { id: (0, crypto_1.randomUUID)(), name,
        description,
        websiteUrl });
    blog_repository_1.BlogRepository.updateBlog(updatedNewBlog);
    return res.sendStatus(201);
});
exports.blogRoutes.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => {
    const id = req.params.id;
    const blog = blog_repository_1.BlogRepository.getBlogById(id);
    if (!blog) {
        return res.sendStatus(404);
    }
    blog_repository_1.BlogRepository.deleteBlogById(id);
    return res.sendStatus(204);
});
exports.blogRoutes.delete('/testing/all-data', (req, res) => {
    db_1.db.blogs.length = 0;
    return res.sendStatus(204);
});
