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
    res.status(201).redirect('/artist');
  } catch (err) {
    res.sendStatus(500).json(err);
  }
  db.close();
};

const readArtistController = async (req, res) => {
  const db = await getDb();
  try {
    const result = await db.query('SELECT * FROM Artist');
    const [artists] = result;
    res.status(200).render('view-artists', { artists: artists });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  db.close();
};

const readSingleArtistController = async (req, res) => {
  const id = req.params.id;
  const db = await getDb();
  try {
    const result = await db.query(`SELECT * FROM Artist WHERE id=?`, [id]);
    const [albums] = await db.query(
      `SELECT Album.id, Album.name, Album.year, Artist.name AS artistName, Artist.id as artistId
    FROM Album LEFT JOIN Artist
    ON Album.artistId = Artist.id 
    WHERE artistId = ?`,
      [id]
    );
    const [[artist]] = result;
    return artist
      ? res.status(200).render('artist', { artist: artist, albums: albums })
      : res.sendStatus(404);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  db.close();
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

    if (selectedArtist) {
      await db.query('UPDATE Artist SET ? WHERE id = ?', [data, id]);
      res.status(200).redirect(`/artist/${id}`);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
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
      res.status(200).redirect('/artist');
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  db.close();
};

module.exports = {
  createArtistController,
  readArtistController,
  readSingleArtistController,
  updatingArtistController,
  deletingArtistController,
};
