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
exports.bearerAuth = exports.authMiddleware = void 0;
const jwt_service_1 = require("../../services/jwt-service");
const users_service_1 = require("../../services/users.service");
const login = 'admin';
const password = 'qwerty';
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.sendStatus(401);
    }
    const [basic, token] = auth.split(" ");
    if (basic !== "Basic") {
        res.sendStatus(401);
        return;
    }
    const decodedData = Buffer.from(token, 'base64').toString();
    const [decodedLogin, decodedPassword] = decodedData.split(":");
    if (decodedLogin !== login || decodedPassword !== password) {
        res.sendStatus(401);
        return;
    }
    return next();
});
exports.authMiddleware = authMiddleware;
const bearerAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.sendStatus(401);
    }
    const [bearer, token] = auth.split(" ");
    if (bearer !== 'Bearer') {
        return res.sendStatus(401);
    }
    console.log('tokentokentokentoken', token);
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
    console.log('userIduserIduserId', userId);
    if (!userId) {
        return res.sendStatus(401);
    }
    const user = yield users_service_1.usersService.findUserById(userId.toString());
    console.log('user', user);
    if (!user) {
        return res.sendStatus(401);
    }
    req.user = user;
    return next();
});
exports.bearerAuth = bearerAuth;
// export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
//     const refreshToken = req.cookies['refreshToken']
//     if (!refreshToken) {
//         return res.status(401).send('Access denied, no token provided ')
//     }
//     const decodedRefreshToken = await jwtService.verifyAndDecodeRefreshToken(refreshToken)
//     if (!decodedRefreshToken) {
//         res.sendStatus(401)
//         return
//     }
//     return next()
// }
