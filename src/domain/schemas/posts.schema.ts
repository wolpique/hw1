import mongoose from 'mongoose'
import { PostsMongoDbType } from '../../types'

const postsSchema = new mongoose.Schema<PostsMongoDbType>({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String }
})

export const PostsModelClass = mongoose.model('posts', postsSchema)
