const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistSongActivitiesService {
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

  async postActivity({
    songId, playlistId, userId, action,
  }) {
    const id = `activities-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const queryActivities = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, createdAt],
    };

    const resultActivities = await this._pool.query(queryActivities);
    if (!resultActivities.rows.length) {
      throw new InvariantError('Activity gagal ditambahkan');
    }
  }

  async getActivitiesByPlaylistId({ playlistId }) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
      FROM users 
      JOIN playlist_song_activities
      ON users.id = playlist_song_activities.user_id
      JOIN songs
      ON songs.id = playlist_song_activities.song_id
      WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist anda tidak ditemukan');
    }

    return result.rows;
  }
}

module.exports = PlaylistSongActivitiesService;
