import express from "express";
import {videoRoutes} from "./routes/video-route";
import {blogRoutes} from "./routes/blog-route";
import {postRoutes} from "./routes/post-route";

export const app = express()

app.use(express.json())

app.use('/videos', videoRoutes)
app.use('/blogs', blogRoutes)
app.use('/posts', postRoutes)





