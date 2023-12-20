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
        
        if (index === -1) {
           return false
        } 

        db.posts.splice(index, 1, updatedPost)

        return true
    }

    static deletePostById (id: string) : boolean {
        const index = db.posts.findIndex(p => p.id === id)

        if (index !== -1) {
            db.posts.splice(index, 1)
            return true
        }else{
            return false
        }
    }
} 