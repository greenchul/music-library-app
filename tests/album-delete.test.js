const app = require('../src/app');
const request = require('supertest');
const { expect } = require('chai');
const getDb = require('../src/services/db');
const { afterEach } = require('mocha');

describe('deleting albums', () => {
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

  describe('/album/:id', () => {
    describe('delete', () => {
      it('Should delete album when passed valid id', async () => {
        const id = albums[0].id;
        const result = await request(app).delete(`/album/${id}`);

        expect(result.status).to.equal(200);
        const [[deletedAlbum]] = await db.query(
          'SELECT * FROM Album WHERE id=?',
          [id]
        );
        expect(!!deletedAlbum).to.be.false;
      });

      it('Should return status code 404 when trying to delete an artist that does not exist', async () => {
        const result = await request(app).delete('/album/9999999999');
        expect(result.status).to.equal(404);
      });
    });
  });
});
