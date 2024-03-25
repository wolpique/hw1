import { Router, Response } from "express";
import { RequestWithParams } from "../models/common/common";
import { BlogParams } from "../models/blog/input/blog.input.models";
import { UsersModelClass } from "../domain/schemas/users.schema";
import { BlogsModelClass } from "../domain/schemas/blogs.schema";
import { PostsModelClass } from "../domain/schemas/posts.schema";
import { DevicesModelClass } from "../domain/schemas/device.schema";

export const testingRoutes = Router({})

testingRoutes.delete('/all-data', async (req: RequestWithParams<BlogParams>, res: Response) => {
    //await database.dropDatabase()
    await UsersModelClass.deleteMany({})
    await BlogsModelClass.deleteMany({})
    await PostsModelClass.deleteMany({})

    await DevicesModelClass.deleteMany({})

    return res.sendStatus(204);
})