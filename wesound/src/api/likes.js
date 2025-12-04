// src/api/likes.js
import { supabase } from "../composables/useSupabase.js";

/**
 * Check if a user has liked a given song (returns boolean)
 */
export async function isSongLiked(userId, songId) {
    if (!userId || !songId) return false;
    const { data, error } = await supabase
        .from("song_likes")
        .select("id")
        .eq("user_id", userId)
        .eq("song_id", songId)
        .limit(1)
        .single();

    if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows (single error) — treat as not liked
        throw error;
    }
    return !!data?.id;
}

/**
 * Add a like row; returns created row
 */
export async function addSongLike(userId, songId) {
    if (!userId || !songId) throw new Error("Missing userId or songId");
    const { data, error } = await supabase
        .from("song_likes")
        .insert([{ user_id: userId, song_id: songId }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Remove a like. Returns deleted id info
 */
export async function removeSongLike(userId, songId) {
    if (!userId || !songId) throw new Error("Missing userId or songId");
    const { data, error } = await supabase
        .from("song_likes")
        .delete()
        .match({ user_id: userId, song_id: songId })
        .select()
        .single();

    if (error) throw error;
    return data;
}
