import { ObjectId } from "mongodb";
import { postCollection } from "../db/db";
import { OutputPostType } from "../models/post/output/post.output.models";
import { postMapper } from "../models/post/mappers/mappers";
import { PostDBType } from "../models/post/post_db/post-db-type";
import { OutputPagePostType } from "../models/post/output/pages.post.output.models";
import { QueryPostInputModel } from "../models/post/input/post.input.query.models";

export class PostRepository {
    
    static async getAllPosts(sortData: QueryPostInputModel): Promise<OutputPagePostType> {

        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'

        const posts = await postCollection
            .find({})
            .sort(sortBy, sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray();
        
            const totalCount = await postCollection.countDocuments()
            const pagesCount = Math.ceil(totalCount / +pageSize)
        return {
            pagesCount, 
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount,
            items: posts.map(postMapper)
        }
    }

    static async getPostById(id: string): Promise<OutputPostType | null > { //id:string???
        const post = await postCollection.findOne({_id: new ObjectId(id)})

        if(!post) {
            return null
        }
        return postMapper(post)

    }

    static async createPost (createdPost: PostDBType): Promise<OutputPostType> {
        const post = await postCollection.insertOne({...createdPost})
        return {
            ...createdPost,
            id: post.insertedId.toString()
        }
    }

    static async updatePost (id: string, updatedPost: PostDBType): Promise<boolean> {
        const post = await postCollection.updateOne({_id: new ObjectId(id)}, { 
        $set: {
            title: updatedPost.title,
            shortDescription: updatedPost.shortDescription,
            content: updatedPost.content,
            blogId: updatedPost.blogId
        }
        }) 

        return !!post.matchedCount

    }

    static async deletePostById (id: string): Promise<boolean> {
        const post = await postCollection.deleteOne({_id: new ObjectId(id)})

        return !!post.deletedCount

    }
} 