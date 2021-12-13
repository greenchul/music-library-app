const getDb = require('../services/db');

const createArtistController = async (req, res) => {
  const db = await getDb();
  const artistName = req.body.name;
  const artistGenre = req.body.genre;
  try {
    console.log(artistName, artistGenre);
    db.query(
      `INSERT INTO Artist (name, genre)
    VALUES (?, ?)`,
      [artistName, artistGenre]
    );
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500).json(err);
  }
  db.close();
};

const readArtistController = async (request, response) => {
  const db = await getDb();
  try {
    const result = await db.query('SELECT * FROM Artist');
    console.log(result);
    response.status(200).send(result[0]);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createArtistController, readArtistController };
