const app = require('../src/app');
const request = require('supertest');
const { expect } = require('chai');
const getDb = require('../src/services/db');

describe('delete an artist', () => {
  let db;
  let artists;
  // before each add artisist to the database
  beforeEach(async () => {
    db = await getDb();
    await Promise.all([
      db.query('INSERT INTO Artist (name, genre) VALUES(?,?)', [
        'The Spill Canvas',
        'alternative',
      ]),
      db.query('INSERT INTO Artist (name, genre) VALUES(?,?)', [
        'Steps',
        'pop',
      ]),
      db.query('INSERT INTO Artist (name, genre) VALUES(?,?)', [
        'koRn',
        'nu-metal',
      ]),
    ]);

    [artists] = await db.query('SELECT * FROM Artist');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Artist');
    await db.close();
  });

  describe('/artist/:id', () => {
    describe('DELETE', () => {
      it('Should delete an artist given the correct id', async () => {
        const artistToDelete = artists[0];
        const id = artistToDelete.id;
        const result = await request(app).delete(`/artist/${id}`);

        expect(result.status).to.equal(200);
        //expect the deleted artist id not to be in the table
        const [[deletedArtist]] = await db.query(
          'SELECT * FROM Artist WHERE id=?',
          [id]
        );

        expect(Boolean(deletedArtist)).to.be.false;
      });

      it('Should return status code 404 if artist is not in the table', async () => {
        const result = await request(app).delete('/artist/78967697');
        expect(result.status).to.equal(404);
      });
    });
  });
});
