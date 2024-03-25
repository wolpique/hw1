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
exports.usersRoute = void 0;
const express_1 = require("express");
const users_repository_1 = require("../repositories/users-repository");
const mongodb_1 = require("mongodb");
const users_validator_1 = require("../middlewares/validators/users-validator");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const queryUsersRepository_1 = require("../query-repositories/queryUsersRepository");
exports.usersRoute = (0, express_1.Router)({});
exports.usersRoute.get('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sortData = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        searchLoginTerm: req.query.searchLoginTerm,
        searchEmailTerm: req.query.searchEmailTerm
    };
    const users = yield queryUsersRepository_1.QueryUsersRepository.getAllUsers(sortData);
    return res.send(users);
}));
exports.usersRoute.post('/', auth_middleware_1.authMiddleware, (0, users_validator_1.usersValidator)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { login, password, email } = req.body;
    const passwordHash = yield bcrypt_1.default.hash(password, 10);
    const newUser = {
        _id: new mongodb_1.ObjectId(),
        login,
        password: passwordHash,
        email,
        createdAt: new Date().toISOString(),
        emailConfirmation: {
            isConfirmed: true,
            code: (0, crypto_1.randomUUID)(),
            expirationDate: new Date()
        },
        rToken: {
            refreshToken: (0, crypto_1.randomUUID)()
        }
    };
    const createUser = yield users_repository_1.UsersRepository.addNewUsers(newUser);
    return res.status(201).send(createUser);
}));
exports.usersRoute.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongodb_1.ObjectId.isValid(id)) {
        return res.sendStatus(404);
    }
    const isDeleted = yield users_repository_1.UsersRepository.deleteUserById(id);
    if (!isDeleted) {
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
}));
