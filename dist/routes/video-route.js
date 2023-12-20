"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRoutes = void 0;
const express_1 = require("express");
const output_1 = require("../types/video/output");
const db_1 = require("../db/db");
exports.videoRoutes = (0, express_1.Router)({});
exports.videoRoutes.get('/videos', (req, res) => {
    res.send(db_1.db.videos);
});
exports.videoRoutes.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = db_1.db.videos.find((v) => v.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    res.send(video);
});
exports.videoRoutes.post('/videos', (req, res) => {
    let error = {
        errorsMessages: []
    };
    let { title, author, availableResolutions } = req.body;
    if (title === null || title === undefined || (typeof title === 'string' && title.trim().length < 1) || title.trim().length > 40) {
        error.errorsMessages.push({ message: "Invalid title", field: "title" });
    }
    if (!author || author.trim().length < 1 || author.trim().length > 20) {
        error.errorsMessages.push({ message: "Invalid author", field: "author" });
    }
    if (Array.isArray(availableResolutions)) {
        availableResolutions.map((r) => {
            !output_1.AvailableResolutions.includes(r) && error.errorsMessages.push({
                message: "Invalid author",
                field: "availableResolutions"
            });
        });
    }
    else {
        availableResolutions = [];
    }
    if (error.errorsMessages.length) {
        res.status(400).send(error);
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(createdAt.getDate() + 1);
    const newVideo = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    };
    db_1.db.videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.videoRoutes.put('/videos/:id', (req, res) => {
    const id = +req.params.id;
    let error = {
        errorsMessages: []
    };
    let { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
    if (title === null || title === undefined || (typeof title === 'string' && title.trim().length < 1) || title.trim().length > 40) {
        error.errorsMessages.push({ message: "Invalid title", field: "title" });
    }
    if (!author || author.trim().length < 1 || author.trim().length > 20) {
        error.errorsMessages.push({ message: "Invalid author", field: "author" });
    }
    if (Array.isArray(availableResolutions)) {
        availableResolutions.map((r) => {
            !output_1.AvailableResolutions.includes(r) && error.errorsMessages.push({
                message: "Invalid author",
                field: "availableResolutions"
            });
        });
    }
    else {
        availableResolutions = [];
    }
    if (typeof canBeDownloaded !== "boolean") {
        canBeDownloaded = false;
        error.errorsMessages.push({ message: "Invalid canBeDownloaded", field: "canBeDownloaded" });
    }
    if (typeof publicationDate !== "string") {
        error.errorsMessages.push({ message: "Invalid publicationDate", field: "publicationDate" });
    }
    if (typeof minAgeRestriction !== "undefined" && typeof minAgeRestriction == "number") {
        minAgeRestriction < 1 || minAgeRestriction > 18 && error.errorsMessages.push({ message: "Invalid minAgRestriction", field: "minAgeRestriction" });
    }
    else {
        minAgeRestriction = null;
    }
    if (error.errorsMessages.length) {
        res.status(400).send(error);
        return;
    }
    const videoIndex = db_1.db.videos.findIndex(v => v.id === id);
    const video = db_1.db.videos.find(v => v.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    const updatedItem = Object.assign(Object.assign({}, video), { canBeDownloaded,
        minAgeRestriction,
        title,
        author,
        availableResolutions, publicationDate: publicationDate ? publicationDate : video.publicationDate });
    db_1.db.videos.splice(videoIndex, 1, updatedItem);
    res.sendStatus(204);
});
exports.videoRoutes.delete('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const videoIndex = db_1.db.videos.findIndex(v => v.id === id);
    if (videoIndex === -1) {
        res.sendStatus(404);
        return;
    }
    const deletedItem = db_1.db.videos.splice(videoIndex, 1)[0];
    res.sendStatus(204).send(deletedItem);
});
exports.videoRoutes.delete('/testing/all-data', (req, res) => {
    db_1.db.videos.length = 0;
    res.sendStatus(204);
});
