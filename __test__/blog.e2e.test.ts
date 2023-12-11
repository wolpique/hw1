import request from 'supertest';
import { app } from '../src/settings'
import dotenv from 'dotenv'
dotenv.config()

const chai = require('chai')
const expect = chai.expect

describe('/videos', () => {
    it('should return video by id', async () => {
        const res = await request(app).get('/videos/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id', 1);
        expect(res.body).to.have.property('title').that.is.a('string');
        expect(res.body).to.have.property('author').that.is.a('string');
        
        const nonExistingResponse = await request(app).get('/videos/999');
        expect(nonExistingResponse.status).to.equal(404);
    }) 

    it('should create a new video', async () => {
        const newVideo = {
            title: 'Wolpik',
            author: 'New Wolpik',
            availableResolutions: ['P720'],
    }
        const res = await request(app).post('/videos').send(newVideo);
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
        expect(res.body.title).to.equal(newVideo.title);
    })

    it('should update an existing video by ID', async () => {
        const updateData = {
          title: 'Updated Title',
          author: 'Updated Author',
          availableResolutions: ['P1080'],
        }
    
        const res = await request(app).put('/videos/1').send(updateData);
        expect(res.status).to.equal(204);
    })

    it('should delete an existing video by ID', async () => {
        const res = await request(app).delete('/videos/1');
        expect(res.status).to.equal(204);
    })

    it('should return 404 for deleting a non-existing video ID', async () => {
        const res = await request(app).delete('/videos/999');
        expect(res.status).to.equal(404);
      });
    
    it('should return 404 for deleting a non-existing video ID', async () => {
        const res = await request(app).delete('/videos/999');
        expect(res.status).to.equal(404);
      });

})   