import express from "express";
import { blogRoutes } from "./routes/blog-route";
import { postRoutes } from "./routes/post-route";
import { testingRoutes } from "./routes/testing-route";
import { usersRoute } from "./routes/users-route";
import { authRoute } from "./routes/auth-route";
import { commentsRoute } from "./routes/comments-route";
import cookieParser from "cookie-parser";

export const app = express()

app.use(express.json())
app.use(cookieParser())

//app.use('/tests', videoRoutes)
app.use('/auth', authRoute)

app.use('/users', usersRoute)

app.use('/blogs', blogRoutes)
app.use('/posts', postRoutes)
app.use('/comments', commentsRoute)

app.use('/testing', testingRoutes)


