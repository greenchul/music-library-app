const app = require('../src/app');
const getDb = require('../src/services/db');
const { expect } = require('chai');
const request = require('supertest');

describe('read albums', () => {
  let db;

  let albums;
  beforeEach(async () => {
    db = await getDb();
    await Promise.all([
      db.query('INSERT INTO Artist(name, genre) VALUES(?,?)', [
        'Evanescence',
        'rock',
      ]),
      db.query('INSERT INTO Artist(name, genre) VALUES(?,?)', ['ACDC', 'rock']),
      db.query('INSERT INTO Artist(name, genre) VALUES(?,?)', [
        'Alanis Morissette',
        'pop',
      ]),
    ]);

    const [[evanescence]] = await db.query(
      'SELECT id FROM Artist WHERE name=?',
      ['Evanescence']
    );
    const [[acdc]] = await db.query('SELECT id FROM Artist WHERE name=?', [
      'ACDC',
    ]);
    const [[Alanis]] = await db.query('SELECT id FROM Artist WHERE name=?', [
      'Alanis Morissette',
    ]);

    await Promise.all([
      db.query('INSERT INTO Album(name, year, artistId) VALUES(?,?,?)', [
        'Fallen',
        2003,
        evanescence.id,
      ]),
      db.query('INSERT INTO Album(name, year, artistId) VALUES(?,?,?)', [
        'Highway to hell',
        1979,
        acdc.id,
      ]),
      db.query('INSERT INTO Album(name, year, artistId) VALUES(?,?,?)', [
        'Jagged Little Pill',
        1995,
        Alanis.id,
      ]),
    ]);
    [albums] = await db.query('SELECT * FROM Album');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Album');
    await db.query('DELETE FROM Artist');
    await db.close();
  });

  describe('/album', () => {
    describe('GET', () => {
      it('Should return all the albums in the database', async () => {
        const result = await request(app).get('/album');
        expect(result.status).to.equal(200);
      });
    });
  });

  describe('/album/:id', () => {
    describe('GET', () => {
      it('should return a single album when passed the album id', async () => {
        const id = albums[0].id;

        const result = await request(app).get(`/album/${id}`);
        expect(result.status).to.equal(200);
      });

      it('should return status code 404 if the album id doesnt exist', async () => {
        const result = await request(app).get('/album/99999999');
        expect(result.status).to.equal(404);
      });
    });
  });
});
