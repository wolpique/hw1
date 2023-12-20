"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = require("express");
const post_repository_1 = require("../repositories/post-repository");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const post_validator_1 = require("../validators/post-validator");
const db_1 = require("../db/db");
const crypto_1 = require("crypto");
const blog_repository_1 = require("../repositories/blog-repository");
exports.postRoutes = (0, express_1.Router)({});
exports.postRoutes.get('/', (req, res) => {
    const posts = post_repository_1.PostRepository.getAllPosts();
    return res.send(posts);
});
exports.postRoutes.get('/:id', auth_middleware_1.authMiddleware, (req, res) => {
    const id = req.params.id;
    const post = post_repository_1.PostRepository.getPostById(id);
    if (!post) {
        return res.sendStatus(404);
    }
    return res.send(post);
});
exports.postRoutes.post('/', auth_middleware_1.authMiddleware, (0, post_validator_1.postValidation)(), (req, res) => {
    let { title, shortDescription, content, blogId } = req.body;
    const blog = blog_repository_1.BlogRepository.getBlogById(blogId);
    if (!blog) {
        return res.sendStatus(404);
    }
    const newPost = {
        id: (0, crypto_1.randomUUID)(),
        title,
        shortDescription,
        content,
        blogId,
        blogName: blog.name
    };
    post_repository_1.PostRepository.createPost(newPost);
    return res.status(201).send(newPost);
});
exports.postRoutes.put('/:id', auth_middleware_1.authMiddleware, (0, post_validator_1.postValidation)(), (req, res) => {
    const id = req.params.id;
    const post = post_repository_1.PostRepository.getPostById(id);
    if (!post) {
        return res.sendStatus(404);
    }
    const { title, shortDescription, content, blogId } = req.body;
    const updatedPost = Object.assign(Object.assign({}, post), { title,
        shortDescription,
        content, blogId: blogId ? blogId : post.blogId });
    return res.status(204).send(updatedPost);
});
exports.postRoutes.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => {
    const id = req.params.id;
    const post = post_repository_1.PostRepository.getPostById(id);
    if (!post) {
        return res.sendStatus(404);
    }
    post_repository_1.PostRepository.deletePostById(id);
    return res.sendStatus(204);
});
exports.postRoutes.delete('/testing/all-data', auth_middleware_1.authMiddleware, (req, res) => {
    db_1.db.posts.length = 0;
    return res.sendStatus(204);
});
