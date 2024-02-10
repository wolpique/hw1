"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersMapper = void 0;
const usersMapper = (usersDb) => {
    return {
        id: usersDb._id.toString(),
        login: usersDb.accountData.login,
        email: usersDb.accountData.email,
        createdAt: usersDb.accountData.createdAt
    };
};
exports.usersMapper = usersMapper;
