import { Router, Request, Response } from "express";
import { UsersRepository } from "../repositories/users-repository";
import { jwtService } from "../services/jwt-service";
import { DevicesRepository } from "../repositories/device-repository";

export const securityDeviceRoute = Router({})

securityDeviceRoute.get('/devices', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res
            .status(401)
            .send('Refresh token is not found')
    }

    const decodedToken = await jwtService.verifyAndDecodeRefreshToken(refreshToken)
    if (!decodedToken) {
        return res
            .status(401)
            .send('Invalid token!')
    }

    const user = await UsersRepository.findUserById(decodedToken.userId)
    if (!user) {
        return res
            .status(401)
            .send('User is not found')
    }

    const devices = await DevicesRepository.getAllDevicesByUser(decodedToken.userId)
    if (!devices) {
        return res.sendStatus(401)
    } else {
        return res.status(200).send(devices)
    }
})


securityDeviceRoute.delete('/devices', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res
            .status(401)
            .send('Refresh token is not found')
    }

    const decodedToken = await jwtService.verifyAndDecodeRefreshToken(refreshToken)

    if (!decodedToken) {
        return res
            .status(401)
            .send('Invalid token!')
    }


    const deleteDevices = await DevicesRepository.deleteAllDevicesExceptCurrent(
        decodedToken.userId,
        decodedToken.deviceId
    )

    if (deleteDevices == true) {
        return res.status(204).send('Device')
    } else {
        return res.status(500).send('Error')
    }
})

securityDeviceRoute.delete('/devices/:deviceId', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const deviceId = req.params.deviceId

    if (!refreshToken) {
        return res
            .status(401)
            .send('Refresh token is not found')
    }

    if (!deviceId) {
        return res
            .status(401)
            .send('DeviceID token is not found')
    }

    const decodedToken = await jwtService.verifyAndDecodeRefreshToken(refreshToken)

    const check = await jwtService.checkValidityOfToken(decodedToken.userId, decodedToken.deviceId, refreshToken)

    if (check == false) {
        return res.status(401).send('Access Denied. Invalid refresh token provided.')
    }

    if (!decodedToken) {
        return res
            .status(401)
            .send('Invalid token!')
    }

    const device = await DevicesRepository.findDeviceIdByUser(deviceId)
    console.log('device', device)

    if (!device) {
        return res
            .status(404)
            .send('Device is not found')
    }

    if (decodedToken.userId !== device.userId) {
        return res
            .status(403)
            .send('Device is not yours')
    }

    const deleted = await DevicesRepository.deleteDeviceById(decodedToken.userId, deviceId)
    if (deleted == false) {
        return res.status(500).send('Error')
    }
    return res.sendStatus(204)
})