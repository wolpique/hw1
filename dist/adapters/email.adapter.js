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
exports.emailNewAdapter = exports.emailAdapter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.emailAdapter = {
    sendEmail(email, subject, message, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = yield nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: 'sholpantlegenova99@gmail.com',
                    pass: 'vmjl jqku mple xels'
                }
            });
            const html = `<h1> Thank for your registration</h1>
            <p>${code}</p>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a></p>`;
            const info = yield transporter.sendMail({
                from: 'Wolpik <sholpantlegenova99@gmail.com>', // sender address
                to: email, // list of receivers
                subject: subject, // Subject line
                html: html, // html body
            });
            return info;
        });
    }
};
exports.emailNewAdapter = {
    sendNewEmail(email, subject, message, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = yield nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: 'sholpantlegenova99@gmail.com',
                    pass: 'vmjl jqku mple xels'
                }
            });
            const html = `<h1> Thank for your registration</h1>
            <p>${code}</p>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a></p>`;
            const info = yield transporter.sendMail({
                from: 'Wolpik <sholpantlegenova99@gmail.com>', // sender address
                to: email, // list of receivers
                subject: subject, // Subject line
                html: html, // html body
            });
            return info;
        });
    }
};
