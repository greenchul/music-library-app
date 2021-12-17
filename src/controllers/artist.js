const getDb = require('../services/db');

const createArtistController = async (req, res) => {
  const db = await getDb();
  const artistName = req.body.name;
  const artistGenre = req.body.genre;
  try {
    console.log(artistName, artistGenre);
    await db.query(
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
    response.status(200).send(result[0]);
  } catch (err) {
    console.log(err);
  }
};

const readSingleArtistController = async (request, response) => {
  const id = request.params.id;
  const db = await getDb();
  try {
    const result = await db.query(`SELECT * FROM Artist WHERE id=?`, [id]);
    const [[artist]] = result;
    return artist
      ? response.status(200).send(artist)
      : response.sendStatus(404);
  } catch (err) {
    console.log(err);
  }
};

const updatingArtistController = async (req, res) => {
  const db = await getDb();

  const data = req.body;
  const id = req.params.id;

  try {
    // find if valid id
    const [[selectedArtist]] = await db.query(
      'SELECT * FROM Artist WHERE id=?',
      [id]
    );
    console.log(selectedArtist);
    if (selectedArtist) {
      await db.query('UPDATE Artist SET ? WHERE id = ?', [data, id]);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
  }

  db.close();
};

const deletingArtistController = async (req, res) => {
  const db = await getDb();
  const id = req.params.id;
  try {
    const [[artistToDelete]] = await db.query(
      'SELECT * FROM Artist WHERE id=?',
      [id]
    );
    if (artistToDelete) {
      await db.query('DELETE FROM Artist WHERE id=?', [id]);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createArtistController,
  readArtistController,
  readSingleArtistController,
  updatingArtistController,
  deletingArtistController,
};
