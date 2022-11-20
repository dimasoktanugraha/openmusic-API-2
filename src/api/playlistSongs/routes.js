const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.addSongByPlaylistIdHandler(request, h),
    options: {
      auth: 'songapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.getSongByPlaylistIdHandler(request, h),
    options: {
      auth: 'songapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (request) => handler.deleteSongByPlaylistIdHandler(request),
    options: {
      auth: 'songapp_jwt',
    },
  },
];

module.exports = routes;
