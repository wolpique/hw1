import { blogCollection, postCollection } from "../db/db";
import { ObjectId } from "mongodb";
import { OutputBlogType } from "../models/blog/output/blog.output.models";
import { blogMapper } from "../models/blog/mappers/mappers";
import {BlogDBType} from "../models/blog/blog_db/blog-db-type"
import { QueryBlogInputModel, QueryPostByBlogIdInputModel } from "../models/blog/input/blog.input.query.models";
import { CreatePostBlogModel } from "../models/blog/input/create.blog.input.models";
import {OutputPageBlogType} from "../models/blog/output/pages.blog.output.models"
import { postMapper } from "../models/post/mappers/mappers";

export class BlogRepository{

    static async getAllBlogs(sortData:QueryBlogInputModel): Promise<OutputPageBlogType> {

        const searchNameTerm = sortData.searchNameTerm ?? null
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        let filter = {}

        if (searchNameTerm) {
            filter = {
                name:{$regex: searchNameTerm, $options: 'i'}
            }
        }

        const blogs = await blogCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray();
        
            const totalCount = await blogCollection.countDocuments(filter)
            const pagesCount = Math.ceil(totalCount / +pageSize)
            
        return {
            pagesCount, 
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount,
            items: blogs.map(blogMapper)
        }
    }

    static async createPostToBlog(blogId: string, postData: CreatePostBlogModel) {
        const blog = await this.getBlogById(blogId)

        const post = {
            title: postData.title,
            shortDescription: postData.shortDescription,
            content: postData.content,
            blogId: blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString()
        }

        const res = await postCollection.insertOne(post)
        return res.insertedId
    }

    static async getBlogById(id: string): Promise<OutputBlogType | null> {
        const blog = await blogCollection.findOne({_id: new ObjectId(id)})

        if (!blog){
            return null
        }
        
        return blogMapper(blog)
        
    }

    static async getPostsByBlogId(blogId: string, sortData: QueryPostByBlogIdInputModel) {
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        const posts = await postCollection
        .find({blogId: blogId})
        .sort(sortBy, sortDirection)
        .skip((+pageNumber - 1) * +pageSize)
        .limit(+pageSize)
        .toArray();

        const totalCount = await postCollection
        .countDocuments({blogId: blogId})

        const pagesCount = Math.ceil(totalCount / +pageSize)

        return {
            pagesCount, 
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount,
            items: posts.map(postMapper)
        }
    }


    static async createBlog(createdBlog: BlogDBType): Promise<OutputBlogType> {
        const blog = await blogCollection.insertOne({...createdBlog})
       
        const newBlog = {
            id: blog.insertedId.toString(),
            ...createdBlog
        }
        return newBlog            
        

    }

    static async updateBlog(id: string, updatedBlog: BlogDBType): Promise<boolean> {
        const blog = await blogCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: updatedBlog.name,
                description: updatedBlog.description,
                websiteUrl: updatedBlog.websiteUrl,                
                isMembership: updatedBlog.isMembership

            }
        })

        return !!blog.matchedCount

    }

    static async deleteBlogById(id:string): Promise<boolean> {
        const blog = await blogCollection.deleteOne({_id: new ObjectId(id)});
        return !!blog.deletedCount
    }
}