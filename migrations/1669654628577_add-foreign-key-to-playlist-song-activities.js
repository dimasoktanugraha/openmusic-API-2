/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // memberikan constraint foreign key pada playlist_id terhadap kolom id dari tabel playlists
  pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_playlist_song_activities.playlist_id_playlists.id pada tabel playlists
  pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlists.id');
};
