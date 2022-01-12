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
    res.status(201).redirect(`/artist/${artistId}`);
  } catch (err) {
    console.log(err);
  }
  db.close();
};

const readAlbumsController = async (req, res) => {
  const db = await getDb();
  try {
    const result = await db.query(
      'SELECT Album.id, Album.name, Album.year, Artist.name AS artistName FROM Album LEFT JOIN Artist ON Album.artistId = Artist.id'
    );

    const [albums] = result;
    res.status(200).render('view-albums', { albums: albums });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
  db.close();
};

const readSingleAlbumController = async (req, res) => {
  const db = await getDb();
  const id = req.params.id;
  try {
    const [[album]] = await db.query('SELECT * FROM Album WHERE id=?', [id]);
    if (album) {
      const result = await db.query(
        'SELECT Album.id, Album.name, Album.year, Artist.name AS artistName FROM Album LEFT JOIN Artist ON Album.artistId = Artist.id WHERE Album.id =?',
        [id]
      );
      const [[album]] = result;
      res.status(200).render('album', { album: album });
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
  db.close();
};

//update album
const updateAlbumController = async (req, res) => {
  const id = req.params.id;
  const db = await getDb();
  const data = req.body;
  try {
    const result = await db.query('SELECT * FROM Album WHERE id=?', [id]);
    const [[album]] = result;

    if (album) {
      await db.query('UPDATE Album SET ? WHERE id=?', [data, id]);
      res.status(200).redirect(`/album/${id}`);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  db.close();
};
//delete album
const deleteAlbumController = async (req, res) => {
  const db = await getDb();
  const id = req.params.id;
  try {
    const result = await db.query('SELECT * FROM Album WHERE id=?', [id]);
    const [[album]] = result;
    if (album) {
      await db.query('DELETE FROM Album WHERE id=?', [id]);
      res.status(200).redirect('/album');
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
  createAlbumController,
  readAlbumsController,
  readSingleAlbumController,
  updateAlbumController,
  deleteAlbumController,
};
