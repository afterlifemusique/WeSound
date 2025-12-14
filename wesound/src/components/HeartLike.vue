<template>
  <button
      class="heart-btn"
      :class="{ liked: likedLocal, busy: busy }"
      :aria-pressed="likedLocal ? 'true' : 'false'"
      :title="likedLocal ? 'Unlike' : 'Like'"
      @click="onToggle"
      @keyup.enter.space.prevent="onToggle"
      :disabled="busy || !userId"
      :aria-disabled="busy || !userId"
  >
    <!-- SVG heart: outline and filled using CSS .liked -->
    <svg class="heart-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
          class="heart-outline"
          d="M12.1 21.35l-1.1-1.02C5.14 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41 1 4.07 2.36h1.36C14.09 5 15.76 4 17.5 4 20.01 4 22 6 22 8.5c0 3.78-3.14 6.86-8.99 11.83l-1.9 1.02z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.2"
      />
      <path
          class="heart-fill"
          d="M12.1 21.35l-1.1-1.02C5.14 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41 1 4.07 2.36h1.36C14.09 5 15.76 4 17.5 4 20.01 4 22 6 22 8.5c0 3.78-3.14 6.86-8.99 11.83l-1.9 1.02z"
          fill="currentColor"
          opacity="0"
      />
    </svg>
  </button>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useUserStore } from "../store/user.js";
import { isSongLiked, addSongLike, removeSongLike } from "../api/likes.js";

const props = defineProps({
  song: { type: Object, required: true }, // must contain id
  size: { type: Number, default: 20 },
});

const emits = defineEmits(["update:liked", "error"]);

// Pinia user store
const userStore = useUserStore();
const userId = userStore.user?.id ?? null;

// local state
const likedLocal = ref(false);
const busy = ref(false);

/**
 * Load initial liked state
 */
async function load() {
  if (!userStore.user || !props.song?.id) {
    likedLocal.value = false;
    return;
  }
  try {
    const liked = await isSongLiked(userStore.user.id, props.song.id);
    likedLocal.value = liked;
  } catch (err) {
    // optional: emit error up
    emits("error", err);
  }
}

onMounted(() => {
  load();
});

// keep in sync if song changes
watch(
    () => props.song?.id,
    (newId) => {
      if (!newId) {
        likedLocal.value = false;
        return;
      }
      load();
    }
);

/**
 * Toggle handler: optimistic UI + supabase
 */
async function onToggle() {
  if (!userStore.user) {
    // optionally open login modal or redirect
    emits("error", new Error("You must be logged in to like songs"));
    return;
  }
  if (!props.song?.id) return;

  busy.value = true;

  // optimistic
  const previous = likedLocal.value;
  likedLocal.value = !previous;
  emits("update:liked", likedLocal.value);

  try {
    if (!previous) {
      // add like
      await addSongLike(userStore.user.id, props.song.id);
    } else {
      // remove like
      await removeSongLike(userStore.user.id, props.song.id);
    }
  } catch (err) {
    // rollback
    likedLocal.value = previous;
    emits("error", err);
  } finally {
    busy.value = false;
  }
}
</script>

<style scoped>
.heart-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: transform 140ms ease;
  color: #b3b3b3; /* outline color */
}

/* hovered pop */
.heart-btn:not(.busy):hover {
  transform: scale(1.05);
  color: #fff;
}

/* liked state: pink-ish like Spotify (you can change) */
.heart-btn.liked {
  color: #1db954; /* spotify green or use red if you prefer */
  transform: scale(1.05);
}

/* little pop when just toggled (use a short animation) */
.heart-btn.liked .heart-fill {
  opacity: 1;
  transition: opacity 200ms ease;
}

/* icon sizing */
.heart-icon {
  width: 20px;
  height: 20px;
}

/* outline path slightly visible when not liked */
.heart-outline {
  stroke-width: 1.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

/* filled path */
.heart-fill {
  fill: currentColor;
  opacity: 0;
}

/* busy state disables pointer */
.heart-btn.busy {
  opacity: 0.6;
  pointer-events: none;
}
</style>
