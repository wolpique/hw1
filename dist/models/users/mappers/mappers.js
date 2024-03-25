"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersMapper = void 0;
const usersMapper = (usersDb) => {
    return {
        id: usersDb._id.toString(),
        login: usersDb.login,
        email: usersDb.email,
        createdAt: usersDb.createdAt
    };
};
exports.usersMapper = usersMapper;
