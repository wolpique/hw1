import { OutputCommentType } from "../models/comments/output/comments.output.model";
import { CommentsDBType } from "../models/comments/comments-db/comments-db-type";
import { CommentsModelClass } from "../domain/schemas/comments.schema";

export class commentsRepository {

    static async createComment(createdComment: CommentsDBType): Promise<string | null> {
        const newComment = new CommentsModelClass({ ...createdComment })
        await newComment.save()
        return newComment.toObject()

    }

    static async updateCommentById(id: string, updateData: OutputCommentType): Promise<boolean> {

        const commentToUpdate = await CommentsModelClass.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
        );
        if (!commentToUpdate) {
            return false;
        }

        return true
    }


    static async deleteCommentById(id: string): Promise<boolean> {
        const result = await CommentsModelClass.findOneAndDelete({ _id: id })
        return !!result
    }
}