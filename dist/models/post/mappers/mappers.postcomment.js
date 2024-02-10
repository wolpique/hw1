"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCommentMapper = void 0;
const postCommentMapper = (postcommentDb) => {
    return {
        id: postcommentDb._id.toString(),
        content: postcommentDb.content,
        commentatorInfo: {
            userId: postcommentDb.commentatorInfo.userId,
            userLogin: postcommentDb.commentatorInfo.userLogin
        },
        createdAt: postcommentDb.createdAt
    };
};
exports.postCommentMapper = postCommentMapper;
