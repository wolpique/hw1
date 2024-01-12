import { app } from '../src/settings'
import request from 'supertest'

import dotenv from 'dotenv'
import supertest from 'supertest'
dotenv.config()

const chai = require('chai')
const expect = chai.expect

describe ('/blogs', () => {
    it ('should create a new blog', async () => {
        const newBlog = {
            name: "Wolpik blog",
            description: "My name is Wolpik",
            websiteUrl: "test@test.com",
            isMembership: false,

        }
        const res = await request(app).post('/blogs').send(newBlog).set('Authorization', "Basic admin:qwerty")
        expect(res.status).to.equal(201)
    })

    it ('should return blog by id', async () => {
        const responseBlogs = await request(app).get('/blogs')
        const blogId = responseBlogs.body[0].id
        const res = await request(app).get(`/blogs/${blogId}`); //шаблонные строки
        expect(res.status).to.equal(200);

        const nonExistingResponse = await request(app).get('/blogs/551137c2f9e1fac808a5f572')
        expect(nonExistingResponse.status).to.equal(404)    })

   

    it ('should update an existing blog by id', async() => {
        const updateBlog = {
            name: "Now it's Woplique blog",
            description: "My name is Wolpique",
            websiteUrl: "some new URL",
        }
        const res = await request(app).put('/blogs').send(updateBlog)
        expect(res.status).to.equal(204)
    })

    it ('should delete blog by id', async() => {
        const res = await request(app).delete('/blogs/1')
        expect(res.status).to.equal(204)
    })

    it ('should return 404 for deleting a non-existing video ID', async() => {
        const res = await request(app).delete('/blogs/999')
        expect(res.status).to.equal(404)
    })

})