import express from "express";
import { blogRoutes } from "./routes/blog-route";
import { postRoutes } from "./routes/post-route";
import { testingRoutes } from "./routes/testing-route";
import { usersRoute } from "./routes/users-route";
import { authRoute } from "./routes/auth-route";
import { commentsRoute } from "./routes/comments-route";
import cookieParser from "cookie-parser";
import { securityDeviceRoute } from "./routes/securityDevices-route";

export const app = express()

app.use(express.json())
app.use(cookieParser())

//app.use('/tests', videoRoutes)
app.use('/auth', authRoute)
app.use('/blogs', blogRoutes)
app.use('/comments', commentsRoute)
app.use('/posts', postRoutes)
app.use('/security', securityDeviceRoute)
app.use('/testing', testingRoutes)
app.use('/users', usersRoute)


