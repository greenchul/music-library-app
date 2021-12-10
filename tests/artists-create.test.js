const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');

describe('create artist', () => {
  describe('/artist', () => {
    describe('POST', () => {
      it('Creates a new artist in the database', async () => {
        const res = await (
          await request(app).post('/artist')
        ).send({
          name: 'Evanescence',
          genre: 'rock',
        });

        expect(res.status).to.equal(201);
      });
    });
  });
});