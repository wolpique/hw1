import { db } from "../db/db";
import { PostType } from "../types/post/output";

export class PostRepository {
    
    static getAllPosts() {
        return db.posts
    }

    static getPostById(id:string) {
        const post = db.posts.find(p => p.id === id)

        if(!post) {
            return null
        }
        return post
    }

    static createPost (createdPost: PostType) {
        db.posts.push(createdPost)
        return createdPost
    }

    static updatePost (updatedPost: PostType) {
        const index = db.posts.findIndex(p => p.id === updatedPost.id)
        
        if (index !== -1) {
            const originalPost = db.posts[index]
            const newUpdatedPost = db.posts.slice()
            newUpdatedPost[index] = updatedPost
            return originalPost
        } 
        const newUpdatedPost = db.posts.splice(index, 1, updatedPost)
        return newUpdatedPost
    }

    static deletePostById (id: string) : PostType | null {
        const index = db.posts.findIndex(p => p.id === id)

        if (index !== -1) {
            const deletePost = db.posts.splice(index, 1)[0]
            return deletePost
        }else{
            return null
        }
    }
} 