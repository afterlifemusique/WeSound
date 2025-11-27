import { ref } from "vue";
import { supabase } from "./useSupabase.js";

export const currentUser = ref(null);

supabase.auth.onAuthStateChange((_event, session) => {
  currentUser.value = session?.user ?? null;
});
