import { Router, Request, Response } from "express";
import { BlogRepository } from "../repositories/blog-repository";
import { BlogBody, BlogParams } from "../models/blog/input/blog.input.models";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { blogValidation } from "../middlewares/validators/blogs-validator";
import { ObjectId } from "mongodb";
import { OutputBlogType } from "../models/blog/output/blog.output.models";
import { RequestWithBody, RequestWithBodyAndParams, RequestWithParams, RequestWithParamsAndQuery, RequestWithQuery } from "../models/common/common";
import { QueryBlogInputModel, QueryPostByBlogIdInputModel } from "../models/blog/input/blog.input.query.models";
import { CreatePostBlogModel } from "../models/blog/input/create.blog.input.models";
import { OutputPostType } from "../models/post/output/post.output.models";
import { OutputPageBlogType } from "../models/blog/output/pages.blog.output.models";
import { OutputPagePostType } from "../models/post/output/pages.post.output.models";
import { postForBlogByIdValidation } from "../middlewares/validators/post-validator";
import { QueryBlogRepository } from "../query-repositories/queryBlogsRepository";
import { QueryPostRepository } from "../query-repositories/queryPostsRepository";

export const blogRoutes = Router({})

blogRoutes.get('/', async (req: RequestWithQuery<QueryBlogInputModel>, res: Response<OutputPageBlogType>) => {
    const sortData = {
        searchNameTerm: req.query.searchNameTerm,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize
    }
    const blogs = await QueryBlogRepository.getAllBlogs(sortData);

    return res.send(blogs)
})

blogRoutes.get('/:id', async (req: RequestWithParams<BlogParams>, res: Response) => {
    const id = req.params.id
    const blog = await BlogRepository.getBlogById(id)

    if (!ObjectId.isValid(id)) {
        return res.sendStatus(404)
    }

    if (!blog) {
        return res.sendStatus(404)
    }
    return res.send(blog)
})

blogRoutes.get('/:id/posts', async (req: RequestWithParamsAndQuery<BlogParams, QueryPostByBlogIdInputModel>, res: Response<OutputPagePostType>) => {
    const id = req.params.id

    const blogs = await BlogRepository.getBlogById(id);

    if (!blogs) {
        res.sendStatus(404)
        return
    }


    if (!ObjectId.isValid(id)) {
        return res.sendStatus(404)
    }

    const sortData = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize
    }
    const posts = await QueryBlogRepository.getPostsByBlogId(id, sortData)

    return res.send(posts)
})

blogRoutes.post('/', authMiddleware, blogValidation(), async (req: RequestWithBody<BlogBody>, res: Response<OutputBlogType>) => {
    let { name, description, websiteUrl } = req.body
    const newBlog = {
        _id: new ObjectId,
        name,
        description,
        websiteUrl,
        isMembership: false,
        createdAt: new Date().toISOString()
    }


    const createBlog = await BlogRepository.createBlog(newBlog);

    return res.status(201).send(createBlog)

})

blogRoutes.post('/:id/posts', authMiddleware, postForBlogByIdValidation(), async (req: RequestWithBodyAndParams<{ id: string }, CreatePostBlogModel>, res: Response<OutputPostType>) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content

    const blogId = req.params.id


    const blogs = await BlogRepository.getBlogById(blogId);

    if (!blogs) {
        res.sendStatus(404)
        return
    }

    const createdPostId = await QueryBlogRepository.createPostToBlog(blogId, { title, shortDescription, content })

    const post = await QueryPostRepository.getPostById(createdPostId.toString())

    if (!post) {
        return res.sendStatus(404)
    }

    return res.status(201).send(post)

})

blogRoutes.put('/:id', authMiddleware, blogValidation(), async (req: RequestWithBodyAndParams<BlogParams, BlogBody>, res: Response) => {
    const id = req.params.id
    const blog = await BlogRepository.getBlogById(id)

    if (!ObjectId.isValid(id)) {
        return res.sendStatus(404)
    }

    if (!blog) {
        return res.sendStatus(404)
    }

    let { name, description, websiteUrl } = req.body

    const updatedNewBlog = {
        ...blog,
        name,
        description,
        websiteUrl
    }

    const blogIsUpdated = await BlogRepository.updateBlog(id, updatedNewBlog)

    if (!blogIsUpdated) {
        return res.sendStatus(404)
    }

    return res.sendStatus(204);

})

blogRoutes.delete('/:id', authMiddleware, async (req: RequestWithParams<BlogParams>, res: Response) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)) {
        return res.sendStatus(404)
    }

    const isDeleted = await BlogRepository.deleteBlogById(id)

    if (!isDeleted) {
        return res.sendStatus(404)

    }

    return res.sendStatus(204)

})