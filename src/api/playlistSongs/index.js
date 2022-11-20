const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, {
    service,
    songService,
    activityService,
    validator,
  }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      service,
      songService,
      activityService,
      validator,
    );
    server.route(routes(playlistSongsHandler));
  },
};
