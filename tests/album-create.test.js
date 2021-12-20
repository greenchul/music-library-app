const app = require('../src/app');
const request = require('supertest');
const getDb = require('../src/services/db');
const { expect } = require('chai');

describe('creating an album', () => {
  let db;
  let artist;
  beforeEach(async () => {
    db = await getDb();
    await db.query('INSERT INTO Artist(name, genre) VALUES(?,?)', [
      'Paramore',
      'rock',
    ]);
    [[artist]] = await db.query('SELECT * FROM Artist');
  });
  afterEach(async () => {
    await db.query('DELETE FROM Album');
    await db.close;
  });
  describe('/artist/:id/album', () => {
    describe('POST', () => {
      it('Should create a new album when passed an artist id', async () => {
        const id = artist.id;
        const result = await request(app)
          .post(`/artist/${id}/album`)
          .send({ name: 'Riot', year: 2007 });
        expect(result.status).to.equal(201);
        const [[createdAlbum]] = await db.query('SELECT * FROM Album');
        expect(createdAlbum.name).to.equal('Riot');
      });
    });
  });
});
