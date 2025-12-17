<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/user';
import { storeToRefs } from 'pinia';
import { useRouter } from "vue-router";

// --- SETUP & STATE ---
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const router = useRouter();

const SESSIONS_KEY = 'sb-multi-sessions';
const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

// --- VAULT UTILS ---
// Retrieve stored sessions from localStorage
const getStoredSessions = () => {
  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
};

// Update or add a session to the "Vault"
const updateVaultWithSession = (session) => {
  if (!session) return;
  const sessions = getStoredSessions();

  const sessionData = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    user: session.user
  };

  const index = sessions.findIndex(s => s.user.id === session.user.id);

  if (index > -1) {
    sessions[index] = sessionData;
  } else {
    sessions.push(sessionData);
  }

  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

// --- DROPDOWN LOGIC ---
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);
const isToggling = ref(false);

function toggleDropdown() {
  if (!isDropdownOpen.value) {
    isToggling.value = true;
    setTimeout(() => isToggling.value = false, 100);
  }
  isDropdownOpen.value = !isDropdownOpen.value;
}

function handleClickOutside(event) {
  if (!isToggling.value && dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Filter so the CURRENT account doesn't show in the "Switch" list
const accountsToSwitchTo = computed(() => {
  const allSessions = getStoredSessions();
  if (!user.value) return allSessions;
  return allSessions.filter(s => s.user.id !== user.value.id);
});

// --- ACTION HANDLERS ---

function goToProfile() {
  if (user.value?.id) {
    router.push(`/profile/${user.value.id}`);
    isDropdownOpen.value = false;
  }
}

async function handleSignOut() {
  const currentId = user.value?.id;

  // 1. Remove current account from the local Vault
  if (currentId) {
    const sessions = getStoredSessions();
    const updatedSessions = sessions.filter(s => s.user.id !== currentId);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
  }

  // 2. Perform Supabase sign out
  await supabase.auth.signOut();
  isDropdownOpen.value = false;

  // 3. Auto-switch to next available or redirect
  const remainingSessions = getStoredSessions();
  if (remainingSessions.length > 0) {
    handleSwitchAccount(remainingSessions[0]);
  } else {
    router.push('/signin');
  }
}

async function handleSwitchAccount(targetAccount) {
  // Set flicker-prevention flag for App.vue
  sessionStorage.setItem('is_switching_account', 'true');

  // 1. Save current session to vault
  const { data: { session: currentSession } } = await supabase.auth.getSession();
  if (currentSession) {
    updateVaultWithSession(currentSession);
  }

  // 2. Set the new session
  const { error } = await supabase.auth.setSession({
    access_token: targetAccount.access_token,
    refresh_token: targetAccount.refresh_token
  });

  if (!error) {
    isDropdownOpen.value = false;
    // 3. Navigate to new profile and reload
    await router.push(`/profile/${targetAccount.user.id}`);
    window.location.reload();
  } else {
    sessionStorage.removeItem('is_switching_account');
    console.error("Switch error:", error);
  }
}

async function handleAddNewAccount() {
  const { data: { session: currentSession } } = await supabase.auth.getSession();
  if (currentSession) {
    updateVaultWithSession(currentSession);
  }

  await supabase.auth.signOut();
  isDropdownOpen.value = false;
  router.push('/signin');
}
</script>

<template>
  <div class="account-dropdown-wrapper" ref="dropdownRef">
    <button @click="toggleDropdown" class="account-trigger" aria-haspopup="true" :aria-expanded="isDropdownOpen">
      <div class="user-info">
        <img
            :src="user?.user_metadata?.avatar_url || DEFAULT_AVATAR"
            @error="(e) => e.target.src = DEFAULT_AVATAR"
            class="trigger-avatar"
            alt="User Avatar"
        />
      </div>
      <svg :class="['arrow-icon', { 'rotated': isDropdownOpen }]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <div v-if="isDropdownOpen" class="account-menu">
      <div class="menu-section">
        <p class="section-label">Signed in as:</p>
        <div class="account-item active profile-link" @click.stop="goToProfile">
          <img
              :src="user?.user_metadata?.avatar_url || DEFAULT_AVATAR"
              @error="(e) => e.target.src = DEFAULT_AVATAR"
              class="item-avatar"
          />
          <div class="item-details">
            <span class="item-username">{{ user?.user_metadata?.username || 'User' }}</span>
            <span class="item-email">View Profile →</span>
          </div>
        </div>
      </div>

      <div v-if="accountsToSwitchTo.length > 0" class="menu-section">
        <p class="section-label">Switch Accounts</p>
        <div v-for="acc in accountsToSwitchTo" :key="acc.user.id" class="account-item">
          <img
              :src="acc.user.user_metadata?.avatar_url || DEFAULT_AVATAR"
              @error="(e) => e.target.src = DEFAULT_AVATAR"
              class="item-avatar"
          />
          <div class="item-details">
            <span class="item-username">{{ acc.user.user_metadata?.username || acc.user.email }}</span>
            <span class="item-email">{{ acc.user.email }}</span>
          </div>
        </div>
      </div>

      <div class="menu-section">
        <button @click.stop="handleAddNewAccount" class="menu-button">+ Add New Account</button>
        <button @click.stop="handleSignOut" class="menu-button sign-out-button">Sign Out</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-dropdown-wrapper {
  position: relative;
  z-index: 9999;
  display: inline-block;
}

.account-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  background: #2a2a2a;
  border-radius: 25px;
  border: 1px solid #404040;
  cursor: pointer;
  transition: background 0.2s;
}

.account-trigger:hover {
  background: #353535;
}

.trigger-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

/* Instagram-style placeholder */
.trigger-avatar-placeholder, .item-avatar:not([src]) {
  background-color: #efefef; /* Light grey */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbdbdb'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
  background-size: 80%;
  background-position: center bottom;
  background-repeat: no-repeat;
  border: 1px solid #dbdbdb;
}

.arrow-icon {
  width: 18px;
  height: 18px;
  margin-left: 8px;
  transition: 0.2s;
  color: white;
}

.arrow-icon.rotated { transform: rotate(180deg); }

.account-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 280px;
  background: #1a1a1a;
  border-radius: 12px;
  border: 1px solid #303030;
  margin-top: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}

.menu-section { padding: 8px 0; border-bottom: 1px solid #303030; }
.menu-section:last-child { border-bottom: none; }

.section-label {
  padding: 0 16px 8px;
  color: #888;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.account-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.1s;
}

.account-item:hover { background: #2a2a2a; }

.item-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
  border: 1px solid rgba(255,255,255,0.1);
}

.active .item-avatar {
  border: 2px solid #b8860b;
}

.item-details { display: flex; flex-direction: column; line-height: 1.3; }
.item-username { font-weight: 600; font-size: 14px; color: white; }
.item-email { font-size: 11px; color: #888; }

.menu-button {
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.menu-button:hover { background: #2a2a2a; }
.sign-out-button { color: #ff4444; }
.sign-out-button:hover { background: rgba(255, 68, 68, 0.1); }
</style>