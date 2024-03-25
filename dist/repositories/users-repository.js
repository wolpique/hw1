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
const mappers_1 = require("../models/users/mappers/mappers");
const users_schema_1 = require("../domain/schemas/users.schema");
class UsersRepository {
    static findUserByRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_schema_1.UsersModelClass.findOne({ 'refreshToken': refreshToken });
            if (!user) {
                return null;
            }
            return user;
        });
    }
    static findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('findByLoginOrEmail');
            const user = yield users_schema_1.UsersModelClass.findOne({ $or: [{ 'login': loginOrEmail }, { 'email': loginOrEmail }] });
            console.log('user', user);
            if (!user) {
                return null;
            }
            return user;
        });
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_schema_1.UsersModelClass.findOne({ 'email': email });
            console.log('user', user, user === null || user === void 0 ? void 0 : user.emailConfirmation.isConfirmed);
            if (!user || user.emailConfirmation.isConfirmed) {
                return null;
            }
            return user;
        });
    }
    static updateConfirmation(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield users_schema_1.UsersModelClass.updateOne({ _id }, { $set: { 'emailConfirmation.isConfirmed': true } });
            return result.modifiedCount === 1;
        });
    }
    static updatePassword(_id, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield users_schema_1.UsersModelClass.updateOne({ _id }, { $set: { 'password': passwordHash } });
            return result.modifiedCount === 1;
        });
    }
    static updateEmailConfirmation(email, updated) {
        return __awaiter(this, void 0, void 0, function* () {
            let updateEmail = yield users_schema_1.UsersModelClass.updateOne({ 'email': email }, {
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
                const result = yield users_schema_1.UsersModelClass.updateOne({ email: newConfirmationData.email }, { $set: { emailConfirmation: newConfirmationData } });
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
            const account = yield users_schema_1.UsersModelClass.findOne({ 'emailConfirmation.code': code });
            return account;
        });
    }
    static createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new users_schema_1.UsersModelClass(user);
            yield newUser.save();
            return newUser.toObject();
        });
    }
    static addNewUsers(createdUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_schema_1.UsersModelClass.create(Object.assign({}, createdUser));
            const newUser = Object.assign({}, createdUser);
            return (0, mappers_1.usersMapper)(newUser);
        });
    }
    static deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_schema_1.UsersModelClass.deleteOne({ _id: new mongodb_1.ObjectId(id) }); // id || _id
            return !!user.deletedCount;
        });
    }
}
exports.UsersRepository = UsersRepository;
