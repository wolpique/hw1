import mongoose from 'mongoose'
import { CommentsMongoDbType } from '../../types'

const commentsSchema = new mongoose.Schema<CommentsMongoDbType>({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    postId: { type: String, required: true },
    createdAt: { type: String, required: true }
})

export const CommentsModelClass = mongoose.model('comments', commentsSchema)
