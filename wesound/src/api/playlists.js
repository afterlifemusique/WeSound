import { supabase } from "../lib/supabase.js";

export async function createPlaylist(title, userId) {
  return supabase.from("playlists").insert({
    title,
    user_id: userId
  });
}

export async function addSongToPlaylist(playlistId, songId) {
  return supabase.from("playlist_songs").insert({ playlist_id: playlistId, song_id: songId });
}
