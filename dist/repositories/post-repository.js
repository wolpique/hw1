"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const db_1 = require("../db/db");
class PostRepository {
    static getAllPosts() {
        return db_1.db.posts;
    }
    static getPostById(id) {
        const post = db_1.db.posts.find(p => p.id === id);
        if (!post) {
            return null;
        }
        return post;
    }
    static createPost(createdPost) {
        db_1.db.posts.push(createdPost);
        return createdPost;
    }
    static updatePost(updatedPost) {
        const index = db_1.db.posts.findIndex(p => p.id === updatedPost.id);
        if (index !== -1) {
            const originalPost = db_1.db.posts[index];
            const newUpdatedPost = db_1.db.posts.slice();
            newUpdatedPost[index] = updatedPost;
            return originalPost;
        }
        const newUpdatedPost = db_1.db.posts.splice(index, 1, updatedPost);
        return newUpdatedPost;
    }
    static deletePostById(id) {
        const index = db_1.db.posts.findIndex(p => p.id === id);
        if (index !== -1) {
            const deletePost = db_1.db.posts.splice(index, 1)[0];
            return deletePost;
        }
        else {
            return null;
        }
    }
}
exports.PostRepository = PostRepository;
