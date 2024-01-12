import { Router,Request,Response } from "express";
import { PostRepository } from "../repositories/post-repository";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
//import { RequestWithBody, RequestWithBodyAndParams, RequestWithParams } from "../types/common";
import { PostBody, PostParams } from "../models/post/input/post.input.models";
import { postValidation } from "../middlewares/validators/post-validator";
import { BlogRepository } from "../repositories/blog-repository";
import { ObjectId } from "mongodb";
import { OutputPostType } from "../models/post/output/post.output.models";
import { RequestWithBody, RequestWithBodyAndParams, RequestWithParams, RequestWithQuery } from "../models/common/common";
import { QueryPostInputModel } from "../models/post/input/post.input.query.models";
import { OutputPagePostType } from "../models/post/output/pages.post.output.models";

export const postRoutes = Router({})

postRoutes.get('/', async (req: RequestWithQuery<QueryPostInputModel>, res:Response<OutputPagePostType>) => {
    const sortData = {
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
    }
    const posts = await PostRepository.getAllPosts(sortData)

    return res.send(posts)

})

postRoutes.get('/:id', async (req: RequestWithParams<PostParams>, res:Response) => {
    const id = req.params.id
    const post = await PostRepository.getPostById(id)

    if (!post) {
        return res.sendStatus(404)
    }
    if (!ObjectId.isValid(id)){
        return res.sendStatus(404)
    }
    return res.send(post)
})

postRoutes.post('/', authMiddleware, postValidation(), async (req:RequestWithBody<PostBody>, res: Response<OutputPostType>) => {

    let {title, shortDescription, content, blogId} = req.body

    const blog = await BlogRepository.getBlogById(blogId)
    if(!blog){
       return res.sendStatus(404)
    }

    const newPost = {
        title,
        shortDescription,
        content,
        blogId,
        blogName: blog.name,
        createdAt: new Date().toISOString()

    }

    const createPost = await PostRepository.createPost(newPost)
    return res.status(201).send(createPost)

})

postRoutes.put('/:id', authMiddleware, postValidation(), async (req:RequestWithBodyAndParams<PostParams, PostBody>, res: Response) => {
    const id = req.params.id
   
    let {title, shortDescription, content, blogId} = req.body
    
   const blog = await BlogRepository.getBlogById(blogId)
    if(!blog){
       return res.sendStatus(404)
    }
   
    const post = await PostRepository.getPostById(id)

    if(!post) {
        return res.sendStatus(404)
    }

    if (!ObjectId.isValid(id)){
        return res.sendStatus(404)
    }   

    const updatedPost = {
        ...post,
        title,
        shortDescription,
        content,
        blogId: blogId,
        createdAt: new Date().toISOString()
    }

    const isUpdated = await PostRepository.updatePost(id, updatedPost)

    return res.status(204).send(isUpdated)
})

postRoutes.delete('/:id', authMiddleware, async (req:RequestWithParams<PostParams>, res: Response) => {
    const id = req.params.id
    const post = PostRepository.getPostById(id)
    
    if (!post) {
        return res.sendStatus(404)
    }

    if (!ObjectId.isValid(id)){
        return res.sendStatus(404)
    }
    
    const isDeleted = await PostRepository.deletePostById(id)

    if (!isDeleted) {
        return res.sendStatus(404)

    }
    return res.sendStatus(204)
})