import { WithId } from "mongodb";
import {BlogDBType} from "../blog_db/blog_db_type"
import { OutputBlogType } from "../output/blog.output.models";


export const blogMapper = (blogDb: WithId<BlogDBType>): OutputBlogType => {
    return {
        id: blogDb._id.toString(),
        name: blogDb.name,
        description: blogDb.description,
        websiteUrl: blogDb.websiteUrl,
        isMembership: blogDb.isMembership,
        createdAt: blogDb.createdAt
    }
}