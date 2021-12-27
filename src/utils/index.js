/* eslint-disable camelcase */
const mapDBToModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const mapDBToModelDetail = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year: parseInt(year, 10),
  performer,
  genre,
  duration: parseInt(duration, 10),
  albumId: album_id == null ? null : album_id,
  insertedAt: created_at,
  updatedAt: updated_at,
});

const mapDBToAlbumDetail = ({
  id,
  name,
  year,
  songs,
}) => ({
  id,
  name,
  year: parseInt(year, 10),
  songs,
});

module.exports = { mapDBToModel, mapDBToModelDetail, mapDBToAlbumDetail };
