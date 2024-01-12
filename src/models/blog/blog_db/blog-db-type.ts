import { ObjectId } from "mongodb"

export type BlogDBType = {
    _id?: ObjectId,
    name: string,
    description: string,
    websiteUrl: string
    isMembership: boolean,
    createdAt: string

}