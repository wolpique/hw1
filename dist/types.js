"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitMongoDbType = exports.emailConfirmationMongoDbType = exports.AuthMongoDbType = exports.DevicesMongoDbType = exports.UsersMongoDbType = exports.CommentsMongoDbType = exports.PostsMongoDbType = exports.BlogsMongoDbType = void 0;
class BlogsMongoDbType {
    constructor(_id, name, description, websiteUrl, isMembership, createdAt) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.isMembership = isMembership;
        this.createdAt = createdAt;
    }
}
exports.BlogsMongoDbType = BlogsMongoDbType;
class PostsMongoDbType {
    constructor(_id, title, shortDescription, content, blogId, blogName, createdAt) {
        this._id = _id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
    }
}
exports.PostsMongoDbType = PostsMongoDbType;
class CommentsMongoDbType {
    constructor(_id, content, commentatorInfo, postId, createdAt) {
        this._id = _id;
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.postId = postId;
        this.createdAt = createdAt;
    }
}
exports.CommentsMongoDbType = CommentsMongoDbType;
class UsersMongoDbType {
    constructor(_id, login, email, password, createdAt, emailConfirmation) {
        this._id = _id;
        this.login = login;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.emailConfirmation = emailConfirmation;
    }
}
exports.UsersMongoDbType = UsersMongoDbType;
class DevicesMongoDbType {
    constructor(_id, ip, title, lastActiveDate, deviceId, userId, refreshTokenSignature) {
        this._id = _id;
        this.ip = ip;
        this.title = title;
        this.lastActiveDate = lastActiveDate;
        this.deviceId = deviceId;
        this.userId = userId;
        this.refreshTokenSignature = refreshTokenSignature;
    }
}
exports.DevicesMongoDbType = DevicesMongoDbType;
class AuthMongoDbType {
    constructor(_id, loginOrEmail, password) {
        this._id = _id;
        this.loginOrEmail = loginOrEmail;
        this.password = password;
    }
}
exports.AuthMongoDbType = AuthMongoDbType;
class emailConfirmationMongoDbType {
    constructor(_id, isConfirmed, code, expirationDate) {
        this._id = _id;
        this.isConfirmed = isConfirmed;
        this.code = code;
        this.expirationDate = expirationDate;
    }
}
exports.emailConfirmationMongoDbType = emailConfirmationMongoDbType;
class RateLimitMongoDbType {
    constructor(_id, IP, URL, date) {
        this._id = _id;
        this.IP = IP;
        this.URL = URL;
        this.date = date;
    }
}
exports.RateLimitMongoDbType = RateLimitMongoDbType;
