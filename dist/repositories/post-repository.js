"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const posts_schema_1 = require("../domain/schemas/posts.schema");
class PostRepository {
    static createPost(createdPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = new posts_schema_1.PostsModelClass(createdPost);
            console.log('newPOst', newPost);
            yield newPost.save();
            return Object.assign(Object.assign({}, createdPost), { id: newPost._id.toString() });
        });
    }
    static updatePost(id, updatedPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const postInstance = yield posts_schema_1.PostsModelClass.findOneAndUpdate({ _id: id }, { $set: updatedPost });
            if (!postInstance)
                return false;
            yield postInstance.save();
            return true;
        });
    }
    static deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield posts_schema_1.PostsModelClass.findByIdAndDelete({ _id: id });
            return !!result;
        });
    }
}
exports.PostRepository = PostRepository;
