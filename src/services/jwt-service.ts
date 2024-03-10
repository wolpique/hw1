import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { devicesCollection } from '../db/db'
//import { TokenVerificationResult } from '../models/tokens/output/token-verify-output'
import { DevicesRepository } from '../repositories/device-repository'

dotenv.config()

export const jwtService = {

    async generateAccessToken(userId: string) {
        const accessToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET!, { expiresIn: '10s' })
        return accessToken
    },

    async generateAndStoreRefreshToken(userId: string, deviceId: string) {
        const issuedAt = new Date()
        const refreshToken = jwt.sign({ userId: userId, deviceId, issuedAt }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '40s' })
        const signature = refreshToken.split('.')[2];

        await devicesCollection.updateOne({ userId: userId, deviceId: deviceId }, { $set: { 'refreshTokenSignature': signature } })

        return refreshToken
    },


    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET!)
            return new ObjectId(result.userId)
        } catch (error) {
            console.log(error)
            return null
        }
    },


    async checkValidityOfToken(userId: string, deviceId: string, refreshToken: string): Promise<boolean> {

        const signature = refreshToken.split('.')[2];

        const isValid = await devicesCollection.findOne({ 'userId': userId, 'deviceId': deviceId })
        if (!isValid || !isValid.refreshTokenSignature) {
            return false;
        }
        console.log('Signature from token:', signature);
        console.log('Stored signature:', isValid?.refreshTokenSignature);


        if (isValid?.refreshTokenSignature !== signature) {
            return false
        } else {
            return true
        }
    },


    async verifyAndDecodeRefreshToken(refreshToken: string) {

        const tokenVerify: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)

        const userId = tokenVerify.userId
        console.log('userId', userId,)


        const deviceId = tokenVerify.deviceId
        console.log('deviceId', deviceId,)


        const issuedAt = tokenVerify.issuedAt
        console.log('issuedAt', issuedAt,)



        return { userId, deviceId, issuedAt }

    },

    async verifyAndDecodeAccessToken(accessToken: string) {

        try {
            const tokenVerify: any = jwt.verify(accessToken, process.env.JWT_SECRET!)

            const userId = tokenVerify.userId
            return userId

        } catch (error) {
            return null
        }
    },
}