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
exports.UsersRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
const mappers_1 = require("../models/users/mappers/mappers");
//import { TokensDBType } from "../models/tokens/token_db/tokens-db-type";
class UsersRepository {
    static getAllUsers(sortData) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function* () {
            const sortBy = (_a = sortData.sortBy) !== null && _a !== void 0 ? _a : 'createdAt';
            const sortDirection = (_b = sortData.sortDirection) !== null && _b !== void 0 ? _b : 'desc';
            const pageNumber = (_c = sortData.pageNumber) !== null && _c !== void 0 ? _c : 1;
            const pageSize = (_d = sortData.pageSize) !== null && _d !== void 0 ? _d : 10;
            const searchLoginTerm = (_e = sortData.searchLoginTerm) !== null && _e !== void 0 ? _e : null;
            const searchEmailTerm = (_f = sortData.searchEmailTerm) !== null && _f !== void 0 ? _f : null;
            let filter = { $or: [] };
            if (searchEmailTerm) {
                (_g = filter['$or']) === null || _g === void 0 ? void 0 : _g.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
            }
            if (searchLoginTerm) {
                (_h = filter['$or']) === null || _h === void 0 ? void 0 : _h.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
            }
            if (((_j = filter['$or']) === null || _j === void 0 ? void 0 : _j.length) === 0) {
                (_k = filter['$or']) === null || _k === void 0 ? void 0 : _k.push({});
            }
            const users = yield db_1.usersCollection
                .find(filter)
                .sort(sortBy, sortDirection)
                .skip((+pageNumber - 1) * +pageSize)
                .limit(+pageSize)
                .toArray();
            const totalCount = yield db_1.usersCollection.countDocuments(filter);
            const pagesCount = Math.ceil(totalCount / +pageSize);
            return {
                pagesCount,
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount,
                items: users.map(mappers_1.usersMapper)
            };
        });
    }
    static findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_type = new mongodb_1.ObjectId(id);
            const user = yield db_1.usersCollection.findOne({ _id: id_type });
            if (!user) {
                return null;
            }
            return (0, mappers_1.usersMapper)(user);
        });
    }
    static findUserByRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.usersCollection.findOne({ 'refreshToken': refreshToken });
            if (!user) {
                return null;
            }
            return user;
        });
    }
    static findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.usersCollection.findOne({ $or: [{ 'accountData.login': loginOrEmail }, { 'accountData.email': loginOrEmail }] });
            return user;
        });
    }
    static updateConfirmation(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_1.usersCollection.updateOne({ _id }, { $set: { 'emailConfirmation.isConfirmed': true } });
            return result.modifiedCount === 1;
        });
    }
    static updateEmailConfirmation(email, updated) {
        return __awaiter(this, void 0, void 0, function* () {
            let updateEmail = yield db_1.usersCollection.updateOne({ 'accountData.email': email }, {
                $set: {
                    'emailConfirmation.code': updated.emailConfirmation.code,
                    'emailConfirmation.expirationDate': updated.emailConfirmation.expirationDate
                }
            });
            return updateEmail.modifiedCount === 1;
        });
    }
    static emailResending(newConfirmationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.usersCollection.updateOne({ email: newConfirmationData.email }, { $set: { emailConfirmation: newConfirmationData } });
                return result.modifiedCount > 0;
            }
            catch (error) {
                console.error('Error updating confirmation data:', error);
                return false;
            }
        });
    }
    static findUserByConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield db_1.usersCollection.findOne({ 'emailConfirmation.code': code });
            return account;
        });
    }
    static createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.usersCollection.insertOne(user);
            return result.insertedId;
        });
    }
    static addNewUsers(createdUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.usersCollection.insertOne(Object.assign({}, createdUser));
            const newUser = Object.assign({}, createdUser);
            return (0, mappers_1.usersMapper)(newUser);
        });
    }
    static deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) }); // id || _id
            return !!user.deletedCount;
        });
    }
}
exports.UsersRepository = UsersRepository;
//route res req
//repository logic
//service utilities
//servio
