import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string, code: string) {
        let transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sholpantlegenova99@gmail.com',
                pass: 'vmjl jqku mple xels'
            }
        })
        const html =
            `<h1> Thank for your registration</h1>
            <p>${code}</p>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a></p>`;

        const info = await transporter.sendMail({
            from: 'Wolpik <sholpantlegenova99@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: html, // html body
        });
        return info
    }
}

export const emailNewAdapter = {
    async sendNewEmail(email: string, subject: string, message: string, code: string) {
        let transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sholpantlegenova99@gmail.com',
                pass: 'vmjl jqku mple xels'
            }
        })
        const html =
            `<h1> Thank for your registration</h1>
            <p>${code}</p>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a></p>`;

        const info = await transporter.sendMail({
            from: 'Wolpik <sholpantlegenova99@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: html, // html body
        });
        return info
    }
}

