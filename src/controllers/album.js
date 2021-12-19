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
  db.close();
};

const readAlbumsController = async (req, res) => {
  const db = await getDb();
  try {
    const [albums] = await db.query('SELECT * FROM Album');
    res.status(200).send(albums);
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
  db.close();
};

module.exports = { createAlbumController, readAlbumsController };
