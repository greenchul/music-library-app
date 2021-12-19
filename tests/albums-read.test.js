const app = require('../src/app');
const getDb = require('../src/services/db');
const { expect } = require('chai');
const request = require('supertest');
const res = require('express/lib/response');

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
    console.log(albums);
  });

  afterEach(async () => {
    await db.query('DELETE FROM Album');
    await db.close();
  });

  describe('/album', () => {
    describe('GET', () => {
      it('Should return all the albums in the database', async () => {
        const result = await request(app).get('/album');
        expect(result.status).to.equal(200);

        expect(result.body.length).to.equal(3);

        expect(result.body[0].name).to.equal('Fallen');
      });
    });
  });

  describe('/album/:id', () => {
    describe('GET', () => {
      it('should return a single album when passed the album id', async () => {
        const id = albums[0].id;
        console.log(id);
        const result = await request(app).get(`/album/${id}`);
        console.log(result);
        expect(result.status).to.equal(200);
        expect(result.body.name).to.equal('Fallen');
      });
    });
  });
});
