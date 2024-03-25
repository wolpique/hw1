import { OutputPostType } from "../models/post/output/post.output.models";
import { PostDBType } from "../models/post/post_db/post-db-type";
import { PostsModelClass } from "../domain/schemas/posts.schema";

export class PostRepository {

    static async createPost(createdPost: PostDBType): Promise<OutputPostType> {
        const newPost = new PostsModelClass(createdPost)
        console.log('newPOst', newPost)
        await newPost.save()
        return {
            ...createdPost,
            id: newPost._id.toString()
        }
    }

    static async updatePost(id: string, updatedPost: PostDBType): Promise<boolean> {
        const postInstance = await PostsModelClass.findOneAndUpdate(
            { _id: id },
            { $set: updatedPost },
        );
        if (!postInstance)
            return false
        await postInstance.save()

        return true

    }

    static async deletePostById(id: string): Promise<boolean> {
        const result = await PostsModelClass.findByIdAndDelete({ _id: id })
        return !!result
    }
} 