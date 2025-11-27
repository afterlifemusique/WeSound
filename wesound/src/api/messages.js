import { supabase } from "../composables/useSupabase.js";

export async function sendMessage(senderId, receiverId, content) {
  return supabase.from("messages").insert({
    sender_id: senderId,
    receiver_id: receiverId,
    content
  });
}

export async function fetchMessages(a, b) {
  return supabase
    .from("messages")
    .select("*")
    .or(`and(sender_id.eq.${a},receiver_id.eq.${b}),and(sender_id.eq.${b},receiver_id.eq.${a})`)
    .order("created_at", { ascending: true });
}
