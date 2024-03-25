import { ObjectId } from "mongodb";
import { BlogsModelClass } from "../domain/schemas/blogs.schema";
import { blogMapper } from "../models/blog/mappers/mappers";
import { OutputBlogType } from "../models/blog/output/blog.output.models";
import { BlogsMongoDbType } from "../types";

export class BlogRepository {

    static async createBlog(createdBlog: BlogsMongoDbType) {
        const newBlog = new BlogsModelClass(createdBlog)
        await newBlog.save()
        return newBlog.toObject()
    }

    static async updateBlog(id: string, updatedBlog: BlogsMongoDbType): Promise<boolean> {
        const blogInstance = await BlogsModelClass.findOne({ _id: id })
        if (!blogInstance)
            return false
        blogInstance.name = updatedBlog.name,
            blogInstance.description = updatedBlog.description,
            blogInstance.websiteUrl = updatedBlog.websiteUrl,
            blogInstance.isMembership = updatedBlog.isMembership

        await blogInstance.save()
        return true

    }

    static async getBlogById(id: string): Promise<OutputBlogType | null> {
        const blog = await BlogsModelClass.findOne({ _id: new ObjectId(id) })
        if (!blog) {
            return null
        }

        return blogMapper(blog)

    }

    static async deleteBlogById(id: string): Promise<boolean> {
        const blogInstance = await BlogsModelClass.findOne({ _id: id })
        if (!blogInstance)
            return false
        await blogInstance.deleteOne()
        return true
    }
}







