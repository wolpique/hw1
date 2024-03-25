import { ObjectId, WithId } from "mongodb"
import { BlogsModelClass } from "../domain/schemas/blogs.schema"
import { QueryBlogInputModel, QueryPostByBlogIdInputModel } from "../models/blog/input/blog.input.query.models"
import { CreatePostBlogModel } from "../models/blog/input/create.blog.input.models"
import { blogMapper } from "../models/blog/mappers/mappers"
import { OutputPageBlogType } from "../models/blog/output/pages.blog.output.models"
import { postMapper } from "../models/post/mappers/mappers"
import { PostsModelClass } from "../domain/schemas/posts.schema"
import { BlogsMongoDbType } from "../types"
import { BlogRepository } from "../repositories/blog-repository"

export class QueryBlogRepository {

    static async getAllBlogs(sortData: QueryBlogInputModel): Promise<OutputPageBlogType> {

        const searchNameTerm = sortData.searchNameTerm ?? null
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        let filter = {}

        if (searchNameTerm) {
            filter = {
                name: { $regex: searchNameTerm, $options: 'i' }
            }
        }

        const blogs: WithId<BlogsMongoDbType>[] = await BlogsModelClass
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .lean();

        const totalCount = await BlogsModelClass.countDocuments(filter)
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
        const blog = await BlogRepository.getBlogById(blogId)
        console.log('blog', blog)

        const post = {
            title: postData.title,
            shortDescription: postData.shortDescription,
            content: postData.content,
            blogId: blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString()
        }

        const res = await PostsModelClass.create(post)
        return res._id
    }

    static async getPostsByBlogId(blogId: string, sortData: QueryPostByBlogIdInputModel) {
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        const posts = await PostsModelClass
            .find({ blogId: blogId })
            .sort(sortBy)
            .sort(sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .lean();

        const totalCount = await PostsModelClass
            .countDocuments({ blogId: blogId })

        const pagesCount = Math.ceil(totalCount / +pageSize)

        return {
            pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount,
            items: posts.map(postMapper)
        }
    }


}