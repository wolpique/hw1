import { MongoClient } from "mongodb"
import {BlogDBType} from "../models/blog/blog_db/blog_db_type"
import {PostDBType } from "../models/post/post_db/post_db_type"


const port = 80;

const uri = process.env.MONGO_URL //|| 'mongodb://localhost:27017'

const client  =new MongoClient("mongodb+srv://pomidorkartoshka:Googledoodle123@cluster0.q2mmgvv.mongodb.net/?retryWrites=true&w=majority")

const database = client.db('blogs-hws')

export const blogCollection = database.collection<BlogDBType>('blogs')

export const postCollection = database.collection<PostDBType>('posts')

export const runDb = async () => {
  try {
    await client.connect()
    console.log('Client connected to Db')

    //console.log(`Listen on port ${port}`);

  }catch (err) {
    console.log(err)
    await client.close()
  }
}


