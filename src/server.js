require('dotenv').config();

const Hapi = require('@hapi/hapi');

const song = require('./api/songs');
const SongService = require('./services/postgres/songService');
const SongValidator = require('./validator/song');

const album = require('./api/albums');
const AlbumService = require('./services/postgres/albumService');
const AlbumValidator = require('./validator/album');

const init = async () => {
  const songService = new SongService();
  const albumService = new AlbumService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
