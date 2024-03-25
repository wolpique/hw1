import mongoose from 'mongoose'


const uri = process.env.MONGO_URL || 'mongodb://localhost:27017'

const databaseName = process.env.MONGO_DB_NAME || 'home_works'

export const runDb = async () => {
  try {
    await mongoose.connect(uri + '/' + databaseName)

    console.log('Client connected to Db')

  } catch (err) {
    console.log(err)
    await mongoose.disconnect()
  }
}


