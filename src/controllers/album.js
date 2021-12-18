const getDb = require('../services/db');

const createAlbumController = async (req, res) => {
  const db = await getDb();
  const artistId = req.params.id;
  const name = req.body.name;
  const year = req.body.year;

  try {
    await db.query('INSERT INTO Album (name, year, artistId) VALUES (?,?,?)', [
      name,
      year,
      artistId,
    ]);
    res.status(201).send('Created album');
  } catch (err) {
    console.log(err);
  }
};

const readAlbumsController = async (req, res) => {
  res.status(200).send('reading all artists');
};

module.exports = { createAlbumController, readAlbumsController };
