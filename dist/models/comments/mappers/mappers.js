"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentmapper = void 0;
const commentmapper = (commentDb) => {
    return {
        id: commentDb._id.toString(),
        content: commentDb.content,
        commentatorInfo: {
            userId: commentDb.commentatorInfo.userId,
            userLogin: commentDb.commentatorInfo.userLogin,
        },
        createdAt: commentDb.createdAt
    };
};
exports.commentmapper = commentmapper;
