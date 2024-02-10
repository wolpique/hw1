import { MongoClient } from "mongodb"
import { BlogDBType } from "../models/blog/blog_db/blog-db-type"
import { PostDBType } from "../models/post/post_db/post-db-type"
import { UsersDBType } from "../models/users/users_db/users-db-type"
import { CommentsDBType } from "../models/comments/comments-db/comments-db-type"
import { EmailConfirmationType } from "../models/email/email_db"
import { TokensDBType } from "../models/tokens/token_db/tokens-db-type"


const uri = process.env.MONGO_URL //|| 'mongodb://localhost:27017'

const client = new MongoClient("mongodb+srv://pomidorkartoshka:Googledoodle123@cluster0.q2mmgvv.mongodb.net/?retryWrites=true&w=majority")

const database = client.db('blogs-hws')

export const blogCollection = database.collection<BlogDBType>('blogs')

export const postCollection = database.collection<PostDBType>('posts')

export const usersCollection = database.collection<UsersDBType>('users')

export const commentCollection = database.collection<CommentsDBType>('comments')

export const tokensCollection = database.collection<TokensDBType>('tokens')

export const emailsModel = database.collection<EmailConfirmationType>('emails')

export const runDb = async () => {
  try {
    await client.connect()
    console.log('Client connected to Db')

    //console.log(`Listen on port ${port}`);

  } catch (err) {
    console.log(err)
    await client.close()
  }
}


