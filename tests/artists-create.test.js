// tests/artist-create.js
const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');
const { afterEach } = require('mocha');

describe('create artist', () => {
  let db;
  beforeEach(async () => (db = await getDb()));

  afterEach(async () => {
    await db.query('DELETE FROM Artist');
    await db.close();
  });
  describe('/artist', () => {
    describe('POST', () => {
      it('creates a new artist in the database', async () => {
        const res = await request(app).post('/artist').send({
          name: 'Evanescence',
          genre: 'rock',
        });

        expect(res.status).to.equal(201);

        const [[artistEntries]] = await db.query(
          `SELECT * FROM Artist WHERE name = 'Evanescence'`
        );

        expect(artistEntries.name).to.equal('Evanescence');
        expect(artistEntries.genre).to.equal('rock');
      });
    });
  });
});
