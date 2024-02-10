import { WithId } from "mongodb";
import { CommentsDBType } from "../comments-db/comments-db-type";
import { OutputCommentType } from "../output/comments.output.model";

export const commentmapper = (commentDb: WithId<CommentsDBType> ): OutputCommentType => {
    return {
        id: commentDb._id.toString(),
        content: commentDb.content,
        commentatorInfo: {
            userId: commentDb.commentatorInfo.userId,
            userLogin: commentDb.commentatorInfo.userLogin
        },
        createdAt: commentDb.createdAt
    }
}