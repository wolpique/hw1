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
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_1 = require("mongodb");
const users_repository_1 = require("../repositories/users-repository");
const add_1 = require("date-fns/add");
const email_manager_1 = require("../managers/email-manager");
const crypto_1 = require("crypto");
const jwt_service_1 = require("./jwt-service");
const queryUsersRepository_1 = require("../query-repositories/queryUsersRepository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.authService = {
    createUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const passwordHash = yield bcrypt_1.default.hash(password, 10);
                const code = (0, crypto_1.randomUUID)();
                const user = {
                    _id: new mongodb_1.ObjectId(),
                    login,
                    email,
                    password: passwordHash,
                    createdAt: new Date().toISOString(),
                    emailConfirmation: {
                        code,
                        expirationDate: (0, add_1.add)(new Date(), {
                            hours: 1,
                            minutes: 3
                        }),
                        isConfirmed: false,
                    },
                };
                const createResult = users_repository_1.UsersRepository.createUser(user);
                yield email_manager_1.emailsManager.sendRegistrationRecoveryMessage(email, code);
                return createResult;
            }
            catch (error) {
                console.error('Error creating user:', error);
                return null;
            }
        });
    },
    emailResending(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const confirmData = yield users_repository_1.UsersRepository.findByLoginOrEmail(email); //null
                if (!confirmData) {
                    console.error('User not found for email:', email);
                    return null;
                }
                if (confirmData.emailConfirmation.isConfirmed === true) {
                    return false;
                }
                const code = (0, crypto_1.randomUUID)();
                const newConfirmationData = Object.assign(Object.assign({}, confirmData), { emailConfirmation: {
                        isConfirmed: false,
                        code: code,
                        expirationDate: (0, add_1.add)(new Date(), {
                            minutes: 5
                        })
                    } });
                yield users_repository_1.UsersRepository.updateEmailConfirmation(email, newConfirmationData);
                yield email_manager_1.emailsManager.sendRegistrationRecoveryMessage(email, code);
                return true;
            }
            catch (error) {
                console.error('Error resending email:', error);
                return null;
            }
        });
    },
    emailResendingPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users_repository_1.UsersRepository.findByLoginOrEmail(email);
                if (!user) {
                    console.error('User not found for email:', email);
                    return null;
                }
                console.log('process.env.TOKEN_SECRET!', process.env.TOKEN_SECRET);
                const passwordCode = jsonwebtoken_1.default.sign({ user: user.id }, process.env.TOKEN_SECRET, { expiresIn: '30m' });
                yield email_manager_1.emailsManager.sendPasswordRecoveryMessage(email, passwordCode);
                return true;
            }
            catch (error) {
                console.error('Error while resending password:', error);
                return true;
            }
        });
    },
    confirmPassword(newPassword, recoveryCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('process.env.TOKEN_SECRET!', process.env.TOKEN_SECRET);
                const payload = jsonwebtoken_1.default.verify(recoveryCode, process.env.TOKEN_SECRET);
                console.log('payload', payload);
                const userId = payload.user;
                console.log('userId', userId);
                const checkUser = yield queryUsersRepository_1.QueryUsersRepository.findUserById(userId);
                if (!checkUser) {
                    return false;
                }
                const passwordHash = yield bcrypt_1.default.hash(newPassword, 10);
                yield users_repository_1.UsersRepository.updatePassword(userId, passwordHash);
                return true;
            }
            catch (error) {
                console.error('Error confirming password:', error);
                return false;
            }
        });
    },
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield users_repository_1.UsersRepository.findUserByConfirmationCode(code);
            if (!user) {
                return false;
            }
            if (user.emailConfirmation.isConfirmed === true) {
                return false;
            }
            if (user.emailConfirmation.expirationDate < new Date()) {
                return false;
            }
            let result = yield users_repository_1.UsersRepository.updateConfirmation(user._id);
            return result;
        });
    },
    loginUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = user._id.toString();
            const newdeviceId = new mongodb_1.ObjectId().toString(); //30-41 auth service method login? return AT RT
            const accessToken = yield jwt_service_1.jwtService.generateAccessToken(user_id);
            const refreshToken = yield jwt_service_1.jwtService.generateAndStoreRefreshToken(user_id, newdeviceId);
            const decoded = yield jwt_service_1.jwtService.decodeRefreshToken(refreshToken);
            return { accessToken, refreshToken, newdeviceId, decoded, user_id };
        });
    },
    meInfo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield queryUsersRepository_1.QueryUsersRepository.findUserById(userId);
            console.log('user', user);
            const { email, login, id } = user;
            return {
                email: email,
                login: login,
                userId: id
            };
        });
    },
};
