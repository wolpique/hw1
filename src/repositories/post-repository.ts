import { ObjectId, WithId } from "mongodb";
import { postCollection } from "../db/db";
import { OutputPostType } from "../models/post/output/post.output.models";
import { postMapper } from "../models/post/mappers/mappers";
import { PostDBType } from "../models/post/post_db/post_db_type";

export class PostRepository {
    
    static async getAllPosts(): Promise<OutputPostType[]> {
        const posts = await postCollection.find({}).toArray()
        return posts.map(postMapper)
    }

    static async getPostById(id:string): Promise<OutputPostType | null > {
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