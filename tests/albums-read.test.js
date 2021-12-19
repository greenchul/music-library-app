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
    await db.close();
  });

  describe('/albums', () => {
    describe('GET', () => {
      it('Should return all the albums in the database', async () => {
        const result = await request(app).get('/albums');
        expect(result.status).to.equal(200);
        const [albums] = await db.query('SELECT * FROM Album');
        console.log(albums);
        expect(albums.length).to.equal(3);
        expect(albums[0].name).to.equal('Fallen');
      });
    });
  });
});
