import { supabase } from "../composables/useSupabase.js";

export async function fetchSongs() {
  return supabase.from("songs").select("*").order("created_at", { ascending: false });
}

export async function likeSong(songId, userId) {
  return supabase.from("song_likes").insert({
    song_id: songId,
    user_id: userId
  });
}
