"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const login = 'admin';
const password = 'qwerty';
const authMiddleware = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        res.sendStatus(401);
        return;
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
};
exports.authMiddleware = authMiddleware;
