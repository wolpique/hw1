import { db } from "../db/db";
import { BlogType } from "../types/blog/output";

export class BlogRepository{
    static getAllBlogs() {
        return db.blogs
    }

    static getBlogById(id: string) {
        const blog = db.blogs.find(b  => b.id === id)

        if (!blog){ 
            return null
        }

        return blog
    }
    static createBlog(createdBlog: BlogType) {
        db.blogs.push(createdBlog)

    }

    static updateBlog(updatedBlog: BlogType) {
        const index = db.blogs.findIndex(blog=> blog.id === updatedBlog.id);

        if (index === -1 ) {
            return false
        }

        db.blogs.splice(index, 1, updatedBlog)
        return true
    }

    static deleteBlogById(id:string):BlogType | null {
        const index = db.blogs.findIndex(blog=> blog.id === id);

        if (index === -1){
            return null
        }
        const deleteBlog = db.blogs.splice(index, 1)[0]
        return deleteBlog 
    }
}