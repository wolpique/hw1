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
exports.postRoutes = void 0;
const express_1 = require("express");
const post_repository_1 = require("../repositories/post-repository");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const post_validator_1 = require("../middlewares/validators/post-validator");
const blog_repository_1 = require("../repositories/blog-repository");
const mongodb_1 = require("mongodb");
const comments_repository_1 = require("../repositories/comments-repository");
const comments_validator_1 = require("../middlewares/validators/comments-validator");
const queryPostsRepository_1 = require("../query-repositories/queryPostsRepository");
const queryCommentsRepository_1 = require("../query-repositories/queryCommentsRepository");
exports.postRoutes = (0, express_1.Router)({});
exports.postRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sortData = {
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
    };
    const posts = yield queryPostsRepository_1.QueryPostRepository.getAllPosts(sortData);
    return res.send(posts);
}));
exports.postRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const post = yield queryPostsRepository_1.QueryPostRepository.getPostById(id);
    if (!post) {
        return res.sendStatus(404);
    }
    if (!mongodb_1.ObjectId.isValid(id)) {
        return res.sendStatus(404);
    }
    return res.send(post);
}));
exports.postRoutes.get('/:id/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const post = yield queryPostsRepository_1.QueryPostRepository.getPostById(id);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    const sortData = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize
    };
    const comment = yield queryPostsRepository_1.QueryPostRepository.getCommentById(id, sortData);
    return res.send(comment);
}));
exports.postRoutes.post('/:id/comments', auth_middleware_1.bearerAuth, (0, comments_validator_1.commentValidator)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const content = req.body.content;
    const { id, login } = req.user;
    const post = yield queryPostsRepository_1.QueryPostRepository.getPostById(postId);
    if (!post) {
        return res.sendStatus(404);
    }
    const newComment = {
        content,
        commentatorInfo: {
            userId: id,
            userLogin: login,
        },
        postId: post.id,
        createdAt: new Date().toISOString()
    };
    const createdCommentId = yield comments_repository_1.commentsRepository.createComment(newComment);
    if (!createdCommentId) {
        return res.sendStatus(404);
    }
    const comment = yield queryCommentsRepository_1.QueryCommentsRepository.getCommentById(createdCommentId);
    if (!comment) {
        return res.sendStatus(404);
    }
    return res.status(201).send(comment);
}));
exports.postRoutes.post('/', auth_middleware_1.authMiddleware, (0, post_validator_1.postValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, shortDescription, content, blogId } = req.body;
    const blog = yield blog_repository_1.BlogRepository.getBlogById(blogId);
    if (!blog) {
        return res.sendStatus(404);
    }
    const newPost = {
        title,
        shortDescription,
        content,
        blogId,
        blogName: blog.name,
        createdAt: new Date().toISOString()
    };
    const createPost = yield post_repository_1.PostRepository.createPost(newPost);
    return res.status(201).send(createPost);
}));
exports.postRoutes.put('/:id', auth_middleware_1.authMiddleware, (0, post_validator_1.postValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { title, shortDescription, content, blogId } = req.body;
    const blog = yield blog_repository_1.BlogRepository.getBlogById(blogId);
    if (!blog) {
        return res.sendStatus(404);
    }
    const post = yield queryPostsRepository_1.QueryPostRepository.getPostById(id);
    if (!post) {
        return res.sendStatus(404);
    }
    if (!mongodb_1.ObjectId.isValid(id)) {
        return res.sendStatus(404);
    }
    const updatedPost = Object.assign(Object.assign({}, post), { title,
        shortDescription,
        content, blogId: blogId, createdAt: new Date().toISOString() });
    const isUpdated = yield post_repository_1.PostRepository.updatePost(id, updatedPost);
    return res.status(204).send(isUpdated);
}));
exports.postRoutes.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const post = queryPostsRepository_1.QueryPostRepository.getPostById(id);
    if (!post) {
        return res.sendStatus(404);
    }
    if (!mongodb_1.ObjectId.isValid(id)) {
        return res.sendStatus(404);
    }
    const isDeleted = yield post_repository_1.PostRepository.deletePostById(id);
    if (!isDeleted) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
