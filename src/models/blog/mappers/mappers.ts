import { WithId } from "mongodb";
import { BlogDBType } from "../blog_db/blog-db-type"
import { OutputBlogType } from "../output/blog.output.models";


export const blogMapper = (blogDb: WithId<BlogDBType>): OutputBlogType => {
    return {
        _id: blogDb._id,
        name: blogDb.name,
        description: blogDb.description,
        websiteUrl: blogDb.websiteUrl,
        isMembership: blogDb.isMembership,
        createdAt: blogDb.createdAt
    }
}

