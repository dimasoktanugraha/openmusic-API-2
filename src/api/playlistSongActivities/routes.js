const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (request, h) => handler.getActivitiesByPlaylistIdHandler(request, h),
    options: {
      auth: 'songapp_jwt',
    },
  },
];

module.exports = routes;
