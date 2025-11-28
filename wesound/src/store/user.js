import { defineStore } from "pinia";
import { currentUser } from "../composables/useUser.js";
import { watch } from "vue";

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

    watch(
        currentUser,
        (newUser) => {
            if (newUser) {
                userStore.setUser(newUser);
            } else {
                userStore.clearUser();
            }
        },
        { immediate: true }
    );
}
