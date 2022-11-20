class PlaylistSongActivitiesHandler {
  constructor(service) {
    this._service = service;
  }

  async getActivitiesByPlaylistIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);

    const activities = await this._service.getActivitiesByPlaylistId({
      playlistId: id,
    });

    const response = h.response({
      status: 'success',
      data: {
        playlistId: id,
        activities,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistSongActivitiesHandler;
