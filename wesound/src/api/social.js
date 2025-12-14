import { supabase } from "../lib/supabase.js";

export async function createThread(userId, content) {
  return supabase.from("threads").insert({ user_id: userId, content });
}

export async function fetchThreads() {
  return supabase.from("threads").select("*, users(username, avatar_url)").order("created_at", { ascending: false });
}
