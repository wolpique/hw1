import { BlogType } from "../types/blog/output"
import { PostType } from "../types/post/output"
import { VideoType } from "../types/video/output"

type DBType = {
  videos: VideoType[],
  blogs: BlogType[]
  posts: PostType[]

}

export const db:DBType  = {
     videos: [{
            id: 1,
            title: "string",
            author: "string",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2023-12-08T09:28:28.412Z",
            publicationDate: "2023-12-08T09:28:28.412Z",
            availableResolutions: [
              "P144"
            ]
        }],
        blogs: [{
          id: "string",
          name: "string",
          description: "string",
          websiteUrl: "string"
        }],
        posts: [{
            id: "string",
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: "string",
            blogName: "string"
          }]
}