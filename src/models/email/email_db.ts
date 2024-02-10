export type EmailConfirmationType = {
    isConfirmed: boolean
    code: string
    expirationDate: Date
}

export type RegistrationDataType = {
    ip: string
}

export type EmailResendingType = {
    email: string
    isConfirmed: boolean
    code: string
    expirationDate: Date

}