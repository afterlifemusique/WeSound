import { defineStore } from "pinia";
import { currentUser } from "../composables/useUser.js";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: currentUser
  })
});
