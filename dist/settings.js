"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const video_route_1 = require("./routes/video-route");
const blog_route_1 = require("./routes/blog-route");
const post_route_1 = require("./routes/post-route");
const testing_route_1 = require("./routes/testing-route");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
//app.use('/tests', videoRoutes)
exports.app.use('/videos', video_route_1.videoRoutes);
exports.app.use('/blogs', blog_route_1.blogRoutes);
exports.app.use('/posts', post_route_1.postRoutes);
exports.app.use('/testing', testing_route_1.testingRoutes);
