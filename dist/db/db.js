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
exports.runDb = exports.emailsModel = exports.devicesCollection = exports.rateLimitColection = exports.commentCollection = exports.usersCollection = exports.postCollection = exports.blogCollection = void 0;
const mongodb_1 = require("mongodb");
const uri = process.env.MONGO_URL; //|| 'mongodb://localhost:27017'
//const client = new MongoClient("mongodb+srv://pomidorkartoshka:Googledoodle123@cluster0.q2mmgvv.mongodb.net/?retryWrites=true&w=majority")
const client = new mongodb_1.MongoClient('mongodb://localhost:27017');
const database = client.db('blogs-hws');
exports.blogCollection = database.collection('blogs');
exports.postCollection = database.collection('posts');
exports.usersCollection = database.collection('users');
exports.commentCollection = database.collection('comments');
exports.rateLimitColection = database.collection('limit');
exports.devicesCollection = database.collection('devices');
exports.emailsModel = database.collection('emails');
const runDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log('Client connected to Db');
    }
    catch (err) {
        console.log(err);
        yield client.close();
    }
});
exports.runDb = runDb;
