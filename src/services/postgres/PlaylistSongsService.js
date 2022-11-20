const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToPlaylistDetail } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async postSongByPlaylistId({ songId, playlistId }) {
    const id = `playlist-song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, playlistId, songId, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongsByPlaylistId({ playlistId }) {
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name, users.username 
      FROM users 
      LEFT JOIN playlists ON users.id = playlists.owner 
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const resultPlaylist = await this._pool.query(queryPlaylist);

    if (!resultPlaylist.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    let songList = [];
    const querySong = {
      text: `SELECT songs.id, songs.title, songs.performer 
      FROM songs
      JOIN playlist_songs
      ON songs.id = playlist_songs.song_id
      JOIN playlists
      ON playlists.id = playlist_songs.playlist_id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const resultSong = await this._pool.query(querySong);
    songList = resultSong.rows;

    const data = resultPlaylist.rows.map(mapDBToPlaylistDetail)[0];
    data.songs = songList;

    return data;
  }

  async deleteSongByPlaylistId({ songId, playlistId }) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = PlaylistSongsService;
