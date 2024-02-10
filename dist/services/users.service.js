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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_repository_1 = require("../repositories/users-repository");
const mongodb_1 = require("mongodb");
const crypto_1 = require("crypto");
exports.usersService = {
    addNewUsers(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            //const passwordSalt = await bcrypt.genSalt(10)
            const passwordHash = yield bcrypt_1.default.hash(password, 10); //passwordSalt
            const newUser = {
                _id: new mongodb_1.ObjectId(),
                accountData: {
                    login,
                    email,
                    password: passwordHash,
                    createdAt: new Date().toISOString()
                },
                emailConfirmation: {
                    isConfirmed: true,
                    code: (0, crypto_1.randomUUID)(),
                    expirationDate: new Date()
                },
                rToken: {
                    refreshToken: (0, crypto_1.randomUUID)(),
                }
            };
            return users_repository_1.UsersRepository.addNewUsers(newUser);
        });
    },
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_repository_1.UsersRepository.findUserById(id);
        });
    },
    findUserByRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_repository_1.UsersRepository.findUserByRefreshToken(refreshToken);
        });
    },
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.UsersRepository.findByLoginOrEmail(loginOrEmail);
            if (!user) {
                return null;
            }
            const checkResult = yield bcrypt_1.default.compare(password, user.accountData.password); //rename pass2
            if (!checkResult) {
                return null;
            }
            return user;
        });
    },
};
