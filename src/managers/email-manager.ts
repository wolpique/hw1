import { emailAdapter, emailNewAdapter } from "../adapters/email.adapter"

export const emailsManager = {
    async sendPasswordRecoveryMessage(email: string, code: string) {
        await emailAdapter.sendEmail(email, "Password Recovery", "Your recovery password is:" + code, code)
    }

}