const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModelDetail } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration = null, albumId = null,
  }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $8) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs({ title = '', performer = '' }) {
    let query;
    let baseQuery = 'SELECT id, title, performer FROM songs';
    if (title !== '' || performer !== '') {
      if (title !== '' && performer === '') {
        baseQuery += ' WHERE LOWER(title) LIKE LOWER($1)';
        query = {
          text: baseQuery,
          values: [`%${title}%`],
        };
      } else if (title === '' && performer !== '') {
        baseQuery += ' WHERE LOWER(performer) LIKE LOWER($1)';
        query = {
          text: baseQuery,
          values: [`%${performer}%`],
        };
      } else {
        baseQuery += ' WHERE LOWER(title) LIKE LOWER($1) AND LOWER(performer) LIKE LOWER($2)';
        query = {
          text: baseQuery,
          values: [`%${title}%`, `%${performer}%`],
        };
      }
    } else {
      query = {
        text: baseQuery,
      };
    }

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapDBToModelDetail)[0];
  }

  async editSongById(id, {
    title, year, performer, genre, duration = null,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updatedAt, id],
    };

    console.log(id);
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongService;
