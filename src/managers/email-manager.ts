import { emailAdapter } from "../adapters/email.adapter"

export const emailsManager = {
    async sendRegistrationRecoveryMessage(email: string, code: string) {
        await emailAdapter.sendEmail(email, "Confirm Account", "Your confirm code is:" + code, code)
    },

    async sendPasswordRecoveryMessage(email: string, signature: string) {
        await emailAdapter.sendEmailPassword(email, "Password Recovery Code", "Your recovery password is:" + signature, signature)
    }

}