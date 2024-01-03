import { WithId } from "mongodb"
import { PostDBType } from "../post_db/post_db_type"
import { OutputPostType } from "../output/post.output.models"

export const postMapper = (postDb: WithId<PostDBType>): OutputPostType => {
    return {
        id: postDb._id.toString(),
        title: postDb.title,
        shortDescription: postDb.shortDescription,
        content: postDb.content,
        blogId: postDb.blogId,
        blogName: postDb.blogName
    }
}