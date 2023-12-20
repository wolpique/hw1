import { Router, Response } from "express";
import { RequestWithParams } from "../types/common";
import { BlogParams } from "../types/blog/input";
import { db } from "../db/db";

export const testingRoutes = Router({})

testingRoutes.delete('/all-data', (req: RequestWithParams<BlogParams>, res: Response) => {
    db.blogs.length = 0;
    return res.sendStatus(204);
})