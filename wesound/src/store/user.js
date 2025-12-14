import { defineStore } from "pinia";
import { supabase } from "../lib/supabase.js";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null,
    }),
    actions: {
        setUser(user) {
            this.user = user;
        },
        clearUser() {
            this.user = null;
        },
    },
});

export function setupUserStoreSync() {
    const userStore = useUserStore();

    supabase.auth.onAuthStateChange((_event, session) => {
        const user = session?.user ?? null;
        if (user) {
            userStore.setUser(user);
        } else {
            userStore.clearUser();
        }
    });
}
