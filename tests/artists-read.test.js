const app = require('../src/app');
const request = require('supertest');
const getDb = require('../src/services/db');
const { expect } = require('chai');

describe('read artist', () => {
  let db;
  let artists;

  beforeEach(async () => {
    db = await getDb();
    await Promise.all([
      db.query('INSERT INTO Artist (name, genre) VALUES(?,?)', [
        'Halestorm',
        'rock',
      ]),
      db.query('INSERT INTO Artist (name, genre) VALUES(?,?)', [
        'Machine Head',
        'metal',
      ]),
      db.query('INSERT INTO Artist (name, genre) VALUES(?,?)', [
        'Sophie Ellis-Bextor',
        'pop',
      ]),
    ]);

    [artists] = await db.query('SELECT * FROM Artist');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Artist');
    await db.close();
  });

  describe('/artist', () => {
    describe('GET', () => {
      it('returns all astist records in the database', async () => {
        const result = await request(app).get('/artist');
        // console.log(result.body);
        expect(result.status).to.equal(200);
        // result.body should be an array of artist objects
        expect(result.body.length).to.equal(3);
        console.log(artists);
        result.body.forEach((record) => {
          console.log(record);
          const fromTests = artists.find((test) => {
            return test.id === record.id;
          });
          console.log(`${record} should equal ${fromTests}`);
          expect(record).to.deep.equal(fromTests);
        });
      });
    });
  });
});
