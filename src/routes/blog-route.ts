import { Router, Request, Response } from "express";
import { BlogRepository } from "../repositories/blog-repository";
//import { RequestWithBody, RequestWithBodyAndParams, RequestWithParams } from "../types/common";
import { BlogBody, BlogParams } from "../models/blog/input/blog.input.models";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { blogValidation } from "../middlewares/validators/blogs-validator";
import { ObjectId } from "mongodb";
import { OutputBlogType } from "../models/blog/output/blog.output.models";
import { RequestWithBody, RequestWithBodyAndParams, RequestWithParams } from "../models/common/common";

export const blogRoutes = Router({})

blogRoutes.get('/', async (req: Request, res:Response) => {
    const blogs = await BlogRepository.getAllBlogs();

    return res.send(blogs)
})

blogRoutes.get('/:id', async (req: RequestWithParams<BlogParams>, res:Response) => {
    const id = req.params.id
    const blog = await BlogRepository.getBlogById(id)

    if (!ObjectId.isValid(id)){
        return res.sendStatus(404)
    }

    if (!blog){
        return res.sendStatus(404)
    }
    return res.send(blog)
})

blogRoutes.post('/', authMiddleware, blogValidation(), async (req: RequestWithBody<BlogBody>, res:Response<OutputBlogType>) => {
    let {name, description, websiteUrl, isMembership} = req.body
    const newBlog = {
        name,
        description,
        websiteUrl,
        isMembership,
        createdAt: new Date().toISOString()
    }
    
    const createBlog = await BlogRepository.createBlog(newBlog);

    return res.status(201).send(createBlog)

})

blogRoutes.put('/:id', authMiddleware, blogValidation(), async (req: RequestWithBodyAndParams<BlogParams, BlogBody>, res:Response) => {
    const id = req.params.id
    const blog = await BlogRepository.getBlogById(id)

    if (!ObjectId.isValid(id)){
        return res.sendStatus(404)
    }

    if (!blog){
        return res.sendStatus(404)
    }

    let {name, description, websiteUrl} = req.body

    const updatedNewBlog = {
        ...blog,
        name,
        description,
        websiteUrl
    }

    const blogIsUpdated = await BlogRepository.updateBlog(id, updatedNewBlog)

    if(!blogIsUpdated){
        return res.sendStatus(404)
    }

    return res.sendStatus(204);

})

blogRoutes.delete('/:id', authMiddleware, async (req:RequestWithParams<BlogParams>, res:Response) => {
    const id = req.params.id
    
    if (!ObjectId.isValid(id)){
        return res.sendStatus(404)
    }

    const isDeleted = await BlogRepository.deleteBlogById(id)

    if (!isDeleted) {
        return res.sendStatus(404)

    }

    return res.sendStatus(204)

})