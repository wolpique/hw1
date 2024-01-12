"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMapper = void 0;
const postMapper = (postDb) => {
    return {
        id: postDb._id.toString(),
        title: postDb.title,
        shortDescription: postDb.shortDescription,
        content: postDb.content,
        blogId: postDb.blogId,
        blogName: postDb.blogName,
        createdAt: postDb.createdAt
    };
};
exports.postMapper = postMapper;
