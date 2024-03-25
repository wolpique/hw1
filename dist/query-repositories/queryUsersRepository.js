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
exports.QueryUsersRepository = void 0;
const mongodb_1 = require("mongodb");
const mappers_1 = require("../models/users/mappers/mappers");
const users_schema_1 = require("../domain/schemas/users.schema");
class QueryUsersRepository {
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
            const users = yield users_schema_1.UsersModelClass
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip((+pageNumber - 1) * +pageSize)
                .limit(+pageSize)
                .lean();
            const totalCount = yield users_schema_1.UsersModelClass.countDocuments(filter);
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
            const user = yield users_schema_1.UsersModelClass.findOne({ _id: id_type });
            if (!user) {
                return null;
            }
            return (0, mappers_1.usersMapper)(user);
        });
    }
}
exports.QueryUsersRepository = QueryUsersRepository;
