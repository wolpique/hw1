import mongoose from 'mongoose'
import { BlogsMongoDbType } from "../../types"

const blogsSchema = new mongoose.Schema<BlogsMongoDbType>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    isMembership: { type: Boolean },
    createdAt: { type: String }
})

export const BlogsModelClass = mongoose.model('blogs', blogsSchema)
