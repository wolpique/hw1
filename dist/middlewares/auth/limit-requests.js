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
exports.limitRequestMiddleware = void 0;
const rateLimit_schema_1 = require("../../domain/schemas/rateLimit.schema");
const maxRequests = 5;
const limitRequestMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const IP = (_a = req.ip) !== null && _a !== void 0 ? _a : 'default';
    const URL = req.url;
    const date = new Date();
    try {
        const count = yield rateLimit_schema_1.RateLimitModelClass.countDocuments({
            IP: IP,
            URL: URL,
            date: { $gte: new Date(Date.now() - 10000) }
        });
        if (count + 1 > maxRequests) {
            return res.status(429).send('Too many requests!');
        }
        yield rateLimit_schema_1.RateLimitModelClass.create({ IP: IP, URL: URL, date: date });
    }
    catch (error) {
        console.error('Error while checking rate limit:', error);
        return res.status(500).send('Internal Server Error');
    }
    return next();
});
exports.limitRequestMiddleware = limitRequestMiddleware;
