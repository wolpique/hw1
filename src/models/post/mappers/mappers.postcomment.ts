import { WithId } from "mongodb"
import { CommentsDBType } from "../../comments/comments-db/comments-db-type"
import { OutputCommentType } from "../../comments/output/comments.output.model"

export const postCommentMapper = (postcommentDb: WithId<CommentsDBType>):OutputCommentType => {
    return {
        id: postcommentDb._id.toString(),
        content: postcommentDb.content,
        commentatorInfo: {
            userId: postcommentDb.commentatorInfo.userId,
            userLogin: postcommentDb.commentatorInfo.userLogin
        },
        createdAt: postcommentDb.createdAt
    }
}
