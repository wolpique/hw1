import { Router, Request, Response } from "express";
import { bearerAuth } from "../middlewares/auth/auth-middleware";
import { commentsRepository } from "../repositories/comments-repository";
import { RequestWithBodyAndParams, RequestWithParams } from "../models/common/common";
import { CommentsBody, CommentsParams } from "../models/comments/input/comment.input.models";
import { commentValidator } from "../middlewares/validators/comments-validator";
import { ObjectId } from "mongodb";
import { QueryCommentsRepository } from "../query-repositories/queryCommentsRepository";


export const commentsRoute = Router({})

commentsRoute.put('/:id', bearerAuth, commentValidator(), async (req: RequestWithBodyAndParams<CommentsParams, CommentsBody>, res: Response) => {
    const commentId = req.params.id
    const { id } = req.user

    if (!ObjectId.isValid(commentId)) {
        return res.sendStatus(404)
    }

    let { content } = req.body

    const comment = await QueryCommentsRepository.getCommentById(commentId)

    if (!comment) {
        return res.sendStatus(404)
    }

    if (comment.commentatorInfo.userId !== id) {
        res.sendStatus(403)
        return
    }

    const updatedData = {
        ...comment,
        content,
    }

    const isUpdated = await commentsRepository.updateCommentById(commentId, updatedData)

    if (!isUpdated) {
        res.sendStatus(404)
        return
    }

    return res.sendStatus(204)
})

commentsRoute.get('/:id', async (req: RequestWithParams<CommentsParams>, res: Response) => {
    const commentId = req.params.id

    const comment = await QueryCommentsRepository.getCommentById(commentId)

    if (!comment) {
        return res.sendStatus(404)
    }
    return res.send(comment)


})

commentsRoute.delete('/:id', bearerAuth, async (req: RequestWithParams<CommentsParams>, res: Response) => {
    const commentId = req.params.id
    const { id } = req.user

    const comment = await QueryCommentsRepository.getCommentById(commentId)

    if (!comment) {
        return res.sendStatus(404)
    }

    if (comment.commentatorInfo.userId !== id) {
        return res.sendStatus(403)
    }

    const isDeleted = await commentsRepository.deleteCommentById(commentId)

    if (!isDeleted) {
        return res.sendStatus(404)
    }

    return res.sendStatus(204)
})