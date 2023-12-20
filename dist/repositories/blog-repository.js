"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepository = void 0;
const db_1 = require("../db/db");
class BlogRepository {
    static getAllBlogs() {
        return db_1.db.blogs;
    }
    static getBlogById(id) {
        const blog = db_1.db.blogs.find(b => b.id === id);
        if (!blog) {
            return null;
        }
        return blog;
    }
    static createBlog(createdBlog) {
        const newBlog = db_1.db.blogs.push(createdBlog);
        return newBlog;
    }
    static updateBlog(updatedBlog) {
        const index = db_1.db.blogs.findIndex(blog => blog.id === updatedBlog.id);
        if (index !== -1) {
            const originalBlog = db_1.db.blogs[index];
            const newUpdatedBlog = db_1.db.blogs.slice();
            newUpdatedBlog[index] = updatedBlog;
            return originalBlog;
        }
        const newUpdatedBlog = db_1.db.blogs.splice(index, 1, updatedBlog);
        return newUpdatedBlog;
    }
    static deleteBlogById(id) {
        const index = db_1.db.blogs.findIndex(blog => blog.id === id);
        if (index === -1) {
            return null;
        }
        const deleteBlog = db_1.db.blogs.splice(index, 1)[0];
        return deleteBlog;
    }
}
exports.BlogRepository = BlogRepository;
