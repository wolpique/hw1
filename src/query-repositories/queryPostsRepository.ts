import { ObjectId } from "mongodb";
import { CommentsModelClass } from "../domain/schemas/comments.schema";
import { PostsModelClass } from "../domain/schemas/posts.schema";
import { QueryCommentByPostIdInputModel } from "../models/comments/comments-db/comment.query.models";
import { QueryPostInputModel } from "../models/post/input/post.input.query.models";
import { postMapper } from "../models/post/mappers/mappers";
import { postCommentMapper } from "../models/post/mappers/mappers.postcomment";
import { OutputPagePostType } from "../models/post/output/pages.post.output.models";
import { OutputPostType } from "../models/post/output/post.output.models";

export class QueryPostRepository {

    static async getPostById(id: string): Promise<OutputPostType | null> { //id:string???
        const post = await PostsModelClass.findOne({ _id: new ObjectId(id) })

        if (!post) {
            return null
        }

        return postMapper(post)

    }

    static async getAllPosts(sortData: QueryPostInputModel): Promise<OutputPagePostType> {

        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'

        const posts = await PostsModelClass
            .find({})
            .sort({ [sortBy]: sortDirection })
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .lean();

        const totalCount = await PostsModelClass.countDocuments()
        const pagesCount = Math.ceil(totalCount / +pageSize)
        return {
            pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount,
            items: posts.map(postMapper)
        }
    }


    static async getCommentById(postId: string, sortData: QueryCommentByPostIdInputModel) {

        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        const posts = await CommentsModelClass
            .find({ postId: postId })
            .sort({ [sortBy]: sortDirection })
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .lean();

        const totalCount = await CommentsModelClass
            .countDocuments({ postId: postId })

        const pagesCount = Math.ceil(totalCount / +pageSize)

        return {
            pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount,
            items: posts.map(postCommentMapper)
        }

    }
}