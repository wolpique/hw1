import { Router, Request, Response } from "express";
import { BlogRepository } from "../repositories/blog-repository";
import { RequestWithBody, RequestWithBodyAndParams, RequestWithParams } from "../types/common";
import { BlogBody, BlogParams } from "../types/blog/input";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { blogValidation } from "../validators/blogs-validator";
import { db } from "../db/db";
import { randomUUID } from "crypto";

export const blogRoutes = Router({})

blogRoutes.get('/', (req: Request, res:Response) => {
    const blogs = BlogRepository.getAllBlogs();

    return res.send(blogs)
})

blogRoutes.get('/:id', (req: RequestWithParams<BlogParams>, res:Response) => {
    const id = req.params.id
    const blog = BlogRepository.getBlogById(id)

    if (!blog){
        return res.sendStatus(404)
    }
    return res.send(blog)
})

blogRoutes.post('/', authMiddleware, blogValidation(), (req: RequestWithBody<BlogBody>, res:Response) => {
    let {name, description, websiteUrl} = req.body
    const newBlog = {
        id: randomUUID(),
        name,
        description,
        websiteUrl,
    }
    
    BlogRepository.createBlog(newBlog);

    return res.status(201).send(newBlog)

})

blogRoutes.put('/:id', authMiddleware, blogValidation(), (req: RequestWithBodyAndParams<BlogParams, BlogBody>, res:Response) => {
    const id = req.params.id
    const blog = BlogRepository.getBlogById(id)

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

    const blogIsUpdated = BlogRepository.updateBlog(updatedNewBlog)

    if(!blogIsUpdated){
        return res.sendStatus(404)
    }

    return res.sendStatus(204);

})

blogRoutes.delete('/:id', authMiddleware, (req:RequestWithParams<BlogParams>, res:Response) => {
    const id = req.params.id
    const blog = BlogRepository.getBlogById(id)

    if (!blog) {
        return res.sendStatus(404)
    }
    BlogRepository.deleteBlogById(id)
    return res.sendStatus(204)

})