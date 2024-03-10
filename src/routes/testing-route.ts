import { Router, Response } from "express";
import { RequestWithParams } from "../models/common/common";
import { BlogParams } from "../models/blog/input/blog.input.models";
import { blogCollection, devicesCollection, postCollection, usersCollection } from "../db/db";

export const testingRoutes = Router({})

testingRoutes.delete('/all-data', async (req: RequestWithParams<BlogParams>, res: Response) => {
    //await database.dropDatabase()
    await usersCollection.deleteMany({})
    await blogCollection.deleteMany({})
    await postCollection.deleteMany({})

    await devicesCollection.deleteMany({})

    return res.sendStatus(204);
})