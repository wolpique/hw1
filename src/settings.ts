import express from "express";
import {blogRoutes} from "./routes/blog-route";
import {postRoutes} from "./routes/post-route";
import { testingRoutes } from "./routes/testing-route";

export const app = express()

app.use(express.json())

//app.use('/tests', videoRoutes)

app.use('/blogs', blogRoutes)
app.use('/posts', postRoutes)

app.use('/testing', testingRoutes)


