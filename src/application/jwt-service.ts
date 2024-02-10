import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { UsersDBType } from '../models/users/users_db/users-db-type'
import { ObjectId } from 'mongodb'
import { TokenVerificationResult } from '../models/tokens/output/token-verify-output'
dotenv.config()

export const jwtService = {
    async generateAccessToken(user: UsersDBType) {
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '12h' })
        return accessToken
    },
    async generateRefreshToken(user: UsersDBType) {
        try {
            const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '30d' })
            return refreshToken
        } catch (error) {
            console.error('Error generating refresh token:', error);
            throw error
        }
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET!)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    },

    async verifyRefreshToken(refreshToken: string): Promise<TokenVerificationResult> {
        try {
            const tokenVerify: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)

            const tokenExpirationTime = tokenVerify.expiredIn * 1000

            const currentTime = Date.now()
            if (tokenExpirationTime < currentTime) {
                return { isValid: false }
            }
            const userId = tokenVerify.user.id

            return { isValid: true, userId }
        } catch (error) {
            console.error('Error while verifying token:', error);
            return { isValid: false }
        }
    },
}