const app = require('../src/app');
const request = require('supertest');
const { expect } = require('chai');
const getDb = require('../src/services/db');
const { afterEach } = require('mocha');

describe('updating albums', () => {
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
    describe('PATCH', () => {
      it('Should update the album with correct information when passed correct id', async () => {
        const id = albums[0].id;
        const result = await request(app)
          .patch(`/album/${id}`)
          .send({ name: 'newName', year: 2000 });
        expect(result.status).to.equal(200);
        const [[updatedAlbum]] = await db.query(
          'SELECT * FROM Album WHERE id=?',
          [id]
        );

        expect(updatedAlbum.name).to.equal('newName');
      });

      it('Should return status code 404 when trying to update an artist that does not exist', async () => {
        const result = await request(app)
          .patch('/album/9999999999')
          .send({ name: 'newName', year: 2000 });

        expect(result.status).to.equal(404);
      });
    });
  });
});
