class PlaylistSongsHandler {
  constructor(service, songService, activityService, validator) {
    this._service = service;
    this._songService = songService;
    this._activityService = activityService;
    this._validator = validator;
  }

  async addSongByPlaylistIdHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._songService.getSongById(songId);

    const playlistSongId = await this._service.postSongByPlaylistId({
      songId, playlistId: id,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke Playlist',
      data: {
        playlistSongId,
      },
    });
    response.code(201);

    await this._activityService.postActivity({
      songId, playlistId: id, userId: credentialId, action: 'add',
    });

    return response;
  }

  async getSongByPlaylistIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);

    const playlist = await this._service.getSongsByPlaylistId({
      playlistId: id,
    });

    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
    response.code(200);
    return response;
  }

  async deleteSongByPlaylistIdHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._songService.getSongById(songId);

    await this._service.deleteSongByPlaylistId({ songId, playlistId: id });
    await this._activityService.postActivity({
      songId, playlistId: id, userId: credentialId, action: 'delete',
    });

    return {
      status: 'success',
      message: 'lagu berhasil dihapus dari Playlist',
    };
  }
}

module.exports = PlaylistSongsHandler;
