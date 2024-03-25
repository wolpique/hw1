import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { DevicesModelClass } from '../domain/schemas/device.schema'

dotenv.config()

export const jwtService = {

    async generateAccessToken(userId: string) {
        const accessToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET!, { expiresIn: '10s' })
        console.log("accessToken", accessToken)

        return accessToken
    },

    async generateAndStoreRefreshToken(userId: string, deviceId: string) {
        const issuedAt = new Date()
        const refreshToken = jwt.sign({ userId: userId, deviceId, issuedAt }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '40s' })
        console.log("refreshToken", refreshToken)
        const signature = refreshToken.split('.')[2];
        console.log("signature", signature)

        await DevicesModelClass.updateOne({ userId: userId, deviceId: deviceId }, { $set: { 'refreshTokenSignature': signature } })

        return refreshToken
    },


    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET!)
            console.log("result", result)

            return new ObjectId(result.userId)
        } catch (error) {
            console.log(error)
            return null
        }
    },


    // async checkValidityOfToken(userId: string, deviceId: string, refreshToken: string): Promise<boolean> {

    //     const signature = refreshToken.split('.')[2];

    //     const isValid = await DevicesModelClass.findOne({ 'userId': userId, 'deviceId': deviceId })
    //     if (!isValid || !isValid.refreshTokenSignature) {
    //         return false;
    //     }
    //     if (isValid?.refreshTokenSignature !== signature) {
    //         return false
    //     } else {
    //         return true
    //     }
    // },

    async decodeRefreshToken(refreshToken: string) {
        const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)

        const userId = decoded.userId

        const deviceId = decoded.deviceId

        const issuedAt = decoded.issuedAt

        return { userId, deviceId, issuedAt }
    },

    // async verifyAndDecodeRefreshToken(refreshToken: string) {

    //     const tokenVerify: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)

    //     const userId = tokenVerify.userId

    //     const deviceId = tokenVerify.deviceId

    //     const issuedAt = tokenVerify.issuedAt

    //     return { userId, deviceId, issuedAt }

    // },

    // async verifyAndDecodeAccessToken(accessToken: string) {

    //     try {
    //         const tokenVerify: any = jwt.verify(accessToken, process.env.JWT_SECRET!)

    //         const userId = tokenVerify.userId
    //         return userId

    //     } catch (error) {
    //         return null
    //     }
    // },
}