import { MongoClient } from "mongodb"
import { BlogDBType } from "../models/blog/blog_db/blog-db-type"
import { PostDBType } from "../models/post/post_db/post-db-type"
import { UsersDBType } from "../models/users/users_db/users-db-type"
import { CommentsDBType } from "../models/comments/comments-db/comments-db-type"
import { EmailConfirmationType } from "../models/email/email_db"
import { DevicesDBType } from "../models/devices/device_db/devices_db"
import { RateLimitDBType } from "../models/rateLimit/rateLimit_db"


const uri = process.env.MONGO_URL //|| 'mongodb://localhost:27017'

//const client = new MongoClient("mongodb+srv://pomidorkartoshka:Googledoodle123@cluster0.q2mmgvv.mongodb.net/?retryWrites=true&w=majority")
const client = new MongoClient('mongodb://localhost:27017')
const database = client.db('blogs-hws')

export const blogCollection = database.collection<BlogDBType>('blogs')

export const postCollection = database.collection<PostDBType>('posts')

export const usersCollection = database.collection<UsersDBType>('users')

export const commentCollection = database.collection<CommentsDBType>('comments')

export const rateLimitColection = database.collection<RateLimitDBType>('limit')

export const devicesCollection = database.collection<DevicesDBType>('devices')

export const emailsModel = database.collection<EmailConfirmationType>('emails')

export const runDb = async () => {
  try {
    await client.connect()
    console.log('Client connected to Db')

  } catch (err) {
    console.log(err)
    await client.close()
  }
}


