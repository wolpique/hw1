import { blogCollection } from "../db/db";
import { ObjectId } from "mongodb";
import { OutputBlogType } from "../models/blog/output/blog.output.models";
import { blogMapper } from "../models/blog/mappers/mappers";
import {BlogDBType} from "../models/blog/blog_db/blog_db_type"

export class BlogRepository{
    static async getAllBlogs(): Promise<OutputBlogType[]> {
        const blogs = await blogCollection.find({}).toArray()
        return blogs.map(blogMapper)
    }

    static async getBlogById(id: string): Promise<OutputBlogType | null> {
        const blog = await blogCollection.findOne({_id: new ObjectId(id)})
        if (!blog){
            return null
        }
        return blogMapper(blog)
        
    }

    static async createBlog(createdBlog: BlogDBType): Promise<OutputBlogType> {
        const blog = await blogCollection.insertOne(createdBlog)

        return {
            ...createdBlog,
            id: blog.insertedId.toString(),
            createdAt: new Date().toISOString(),
            isMembership: false
        }

    }

    static async updateBlog(id: string, updatedBlog: BlogDBType): Promise<boolean> {
        const blog = await blogCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: updatedBlog.name,
                description: updatedBlog.description,
                websiteUrl: updatedBlog.websiteUrl
            }
        })

        return !!blog.matchedCount

    }

    static async deleteBlogById(id:string): Promise<boolean> {
        const blog = await blogCollection.deleteOne({_id: new ObjectId(id)});
        return !!blog.deletedCount
    }
}