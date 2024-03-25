import { ObjectId } from "mongodb"
import { CommentsModelClass } from "../domain/schemas/comments.schema"
import { commentmapper } from "../models/comments/mappers/mappers"
import { OutputCommentType } from "../models/comments/output/comments.output.model"


export class QueryCommentsRepository {

    static async getCommentById(id: string): Promise<OutputCommentType | null> {
        const comment = await CommentsModelClass.findOne({ _id: new ObjectId(id) })

        if (!comment) {
            return null
        }

        return commentmapper(comment)
    }
}