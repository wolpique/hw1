import { ObjectId } from "mongodb";
import { commentCollection } from "../db/db";
import { OutputCommentType } from "../models/comments/output/comments.output.model";
import { commentmapper } from "../models/comments/mappers/mappers";
import { CommentsDBType } from "../models/comments/comments-db/comments-db-type";

export class commentsRepository {

    static async getCommentById(id: string): Promise<OutputCommentType | null> {
        const comment = await commentCollection.findOne({_id: new ObjectId(id)})

        if (!comment) {
            return null
        }
        
        return commentmapper(comment)
    }

    static async createComment(createdComment: CommentsDBType): Promise<string | null> {
        try{
            const comment = await commentCollection.insertOne({...createdComment})

            return comment.insertedId.toString()
        }catch{
            return null
        }
    }

    static async updateCommentById(id: string, updateData: OutputCommentType): Promise<boolean> {
        const comment = await commentCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                content: updateData.content
            }
        })
        return !!comment.matchedCount
    }


    static async deleteCommentById(id: string): Promise<boolean> {
        const comment = await commentCollection.deleteOne({_id: new ObjectId(id)})
        return !!comment.deletedCount
    }
}