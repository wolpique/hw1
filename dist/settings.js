"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blog_route_1 = require("./routes/blog-route");
const post_route_1 = require("./routes/post-route");
const testing_route_1 = require("./routes/testing-route");
const users_route_1 = require("./routes/users-route");
const auth_route_1 = require("./routes/auth-route");
const comments_route_1 = require("./routes/comments-route");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const securityDevices_route_1 = require("./routes/securityDevices-route");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
//app.use('/tests', videoRoutes)
exports.app.use('/auth', auth_route_1.authRoute);
exports.app.use('/blogs', blog_route_1.blogRoutes);
exports.app.use('/comments', comments_route_1.commentsRoute);
exports.app.use('/posts', post_route_1.postRoutes);
exports.app.use('/security', securityDevices_route_1.securityDeviceRoute);
exports.app.use('/testing', testing_route_1.testingRoutes);
exports.app.use('/users', users_route_1.usersRoute);
