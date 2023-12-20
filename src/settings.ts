import express from "express";
import {videoRoutes} from "./routes/video-route";
import {blogRoutes} from "./routes/blog-route";
import {postRoutes} from "./routes/post-route";
import { testingRoutes } from "./routes/testing-route";

export const app = express()

app.use(express.json())

//app.use('/tests', videoRoutes)

app.use('/videos', videoRoutes)
app.use('/blogs', blogRoutes)
app.use('/posts', postRoutes)

app.use('/testing', testingRoutes)


