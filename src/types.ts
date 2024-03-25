//import { ObjectId } from "mongoose";
import { ObjectId } from "mongodb"

export class BlogsMongoDbType {
    constructor(
        public _id: ObjectId,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public isMembership: boolean,
        public createdAt: string,
    ) { }
}

export class PostsMongoDbType {
    constructor(
        public _id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,

    ) { }
}
export class CommentsMongoDbType {
    constructor(
        public _id: ObjectId,
        public content: string,
        public commentatorInfo: {
            userId: string,
            userLogin: string,
        },
        public postId: string,
        public createdAt: string,
    ) { }
}
export class UsersMongoDbType {
    constructor(
        public _id: ObjectId,
        public login: string,
        public email: string,
        public password: string,
        public createdAt: string,
        public emailConfirmation: emailConfirmationMongoDbType,
    ) { }
}
export class DevicesMongoDbType {
    constructor(
        public _id: ObjectId,
        public ip: string,
        public title: string,
        public lastActiveDate: string,
        public deviceId: string,
        public userId: string,
        public refreshTokenSignature: string,

    ) { }
}
export class AuthMongoDbType {
    constructor(
        public _id: ObjectId,
        public loginOrEmail: string,
        public password: string,
    ) { }
}
export class emailConfirmationMongoDbType {
    constructor(
        public _id: ObjectId,
        public isConfirmed: boolean,
        public code: string,
        public expirationDate: Date,

    ) { }
}
export class RateLimitMongoDbType {
    constructor(
        public _id: ObjectId,
        public IP: string,
        public URL: string,
        public date: Date,

    ) { }
}