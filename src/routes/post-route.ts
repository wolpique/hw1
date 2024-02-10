import { Router,Request,Response } from "express";
import { PostRepository } from "../repositories/post-repository";
import { authMiddleware, bearerAuth } from "../middlewares/auth/auth-middleware";
//import { RequestWithBody, RequestWithBodyAndParams, RequestWithParams } from "../types/common";
import { PostBody, PostParams } from "../models/post/input/post.input.models";
import { postValidation } from "../middlewares/validators/post-validator";
import { BlogRepository } from "../repositories/blog-repository";
import { ObjectId } from "mongodb";
import { OutputPostType } from "../models/post/output/post.output.models";
import { RequestWithBody, RequestWithBodyAndParams, RequestWithParams, RequestWithParamsAndQuery, RequestWithQuery } from "../models/common/common";
import { QueryPostInputModel } from "../models/post/input/post.input.query.models";
import { OutputPagePostType } from "../models/post/output/pages.post.output.models";
import { CommentsBody, CommentsParams } from "../models/comments/input/comment.input.models";
import { QueryCommentByPostIdInputModel } from "../models/comments/comments-db/comment.query.models";
import { commentsRepository } from "../repositories/comments-repository";
import { commentValidator } from "../middlewares/validators/comments-validator";
import { OutputCommentType } from "../models/comments/output/comments.output.model";
import { log } from "console";
import { CommentsDBType } from "../models/comments/comments-db/comments-db-type";

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

postRoutes.get('/:id/comments', async (req:RequestWithParamsAndQuery<CommentsParams, QueryCommentByPostIdInputModel>, res:Response) => {
    const id = req.params.id
    const post = await PostRepository.getPostById(id)

    if (!post){
        res.sendStatus(404)
        return
    }
    const sortData = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize
    }

    const comment = await PostRepository.getCommentById(id, sortData)

    return res.send(comment)
})


postRoutes.post('/:id/comments', bearerAuth, commentValidator(), async (req: RequestWithBodyAndParams<CommentsParams,CommentsBody>, res: Response) => {
    const postId = req.params.id
    const content = req.body.content

    const {id, login } = req.user

    const post = await PostRepository.getPostById(postId)

    if (!post) {
        return res.sendStatus(404)
    }

    const newComment: CommentsDBType = {
        content,
        commentatorInfo: {
            userId: id,
            userLogin: login
        },
        postId: post.id!,
        createdAt: new Date().toISOString()
    }

    const createdCommentId = await commentsRepository.createComment(newComment)

    if(!createdCommentId){
        return res.sendStatus(404)
    }

    const comment = await commentsRepository.getCommentById(createdCommentId)

    if (!comment) {
        return res.sendStatus(404)
    }

    return res.status(201).send(comment)

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