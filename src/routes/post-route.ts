import { Router,Request,Response } from "express";
import { PostRepository } from "../repositories/post-repository";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { RequestWithBody, RequestWithBodyAndParams, RequestWithParams } from "../types/common";
import { PostBody, PostParams } from "../types/post/input";
import { postValidation } from "../validators/post-validator";
import { db } from "../db/db";
import { randomUUID } from "crypto";
import { body } from "express-validator";
import { BlogRepository } from "../repositories/blog-repository";

export const postRoutes = Router({})

postRoutes.get('/', (req: Request, res:Response) => {
    const posts = PostRepository.getAllPosts()

    return res.send(posts)

})

postRoutes.get('/:id', (req: RequestWithParams<PostParams>, res:Response) => {
    const id = req.params.id
    const post = PostRepository.getPostById(id)

    if (!post) {
        return res.sendStatus(404)
    }
    return res.send(post)
})

postRoutes.post('/', authMiddleware, postValidation(), (req:RequestWithBody<PostBody>, res: Response) => {

    let {title, shortDescription, content, blogId} = req.body
    const blog = BlogRepository.getBlogById(blogId)

    if (!blog) {
        return res.sendStatus(404)
    }
    const newPost = {
        id: randomUUID(),
        title,
        shortDescription,
        content,
        blogId,
        blogName: blog.name
    }

    PostRepository.createPost(newPost)
    return res.status(201).send(newPost)

})

postRoutes.put('/:id', authMiddleware, postValidation(), (req:RequestWithBodyAndParams<PostParams, PostBody>, res: Response,) => {
    const id = req.params.id
    const post = PostRepository.getPostById(id)

    if(!post) {
        return res.sendStatus(404)
    }
   
    const {title, shortDescription, content, blogId} = req.body
    const updatedPost = {
        ...post,
        title,
        shortDescription,
        content,
        blogId: blogId ? blogId: post.blogId
    }
    return res.status(204).send(updatedPost)
})

postRoutes.delete('/:id', authMiddleware, (req:RequestWithParams<PostParams>, res: Response) => {
    const id = req.params.id
    const post = PostRepository.getPostById(id)
    
    if (!post) {
        return res.sendStatus(404)
    }
    PostRepository.deletePostById(id)
    return res.sendStatus(204)
})

postRoutes.delete('/testing/all-data', authMiddleware, (req:RequestWithParams<PostParams>, res:Response) => {
    db.posts.length = 0;
    return res.sendStatus(204);
})