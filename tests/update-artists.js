const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');
const { afterEach } = require('mocha');

describe('update artist', () => {
  let db;
  let artists;
  beforeEach(async () => {
    //before each test get the db
    db = await getDb();
    // insert the following record in to the artist table
    //Promise.all takes an array of promises
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
        'The Spill Canvas',
        'alternative',
      ]),
    ]);
    // array destructuring, will take the first array from the array of arrays
    [artists] = await db.query('SELECT * FROM Artist');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Artist');
    await db.close();
  });
  describe('/artist/:id', () => {
    describe('PATCH', () => {
      it('Updates a single artist with the correct ID', async () => {
        const artist = artists[0];
        console.log(artist.id);
        const artistID = artist.id;
        const result = await request(app)
          .patch(`/artist/${artist.id}`)
          .send({ name: 'test name', genre: 'test genre' });

        //expect the status code to be 200
        expect(result.status).to.equal(200);

        // expect artist to be {name: "test name", genre: "test genre"}
        const [[updatedArtist]] = await db.query(
          `SELECT * FROM Artist Where id=?`,
          [artistID]
        );

        expect(updatedArtist.name).to.equal('test name');
      });
    });
  });
});
