import { app } from '../src/settings'
import request from 'supertest'

import dotenv from 'dotenv'
import supertest from 'supertest'
import { jwtService } from '../src/application/jwt-service'
import { cookieService } from '../src/application/cookies'
dotenv.config()

const chai = require('chai')
const expect = chai.expect
const usersServiceMock = {
    checkCredentials: jest.fn(),
};
const jwtServiceMock = {
    generateAccessToken: jest.fn(),
};
const cookieServiceMock = {
    setRefreshTokenCookie: jest.fn(),
};

describe('/auth/login', () => {
    it('should return a valid access token when credentials are correct', async () => {
        const mockUser = {
            loginOrEmail: 'sholpan99',
            password: '12345',
        }
        const user = { _id: 'some-user-id' };
        const accessToken = 'valid-access-token';
        const refreshToken = 'valid-refresh-token';

        usersServiceMock.checkCredentials.mockResolvedValue(user);
        jwtServiceMock.generateAccessToken.mockResolvedValue(accessToken);

        const res = await request(app).post('/login').send(mockUser)
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.status).to.equal(200)

    })

})