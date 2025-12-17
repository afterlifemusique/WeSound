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

// 1. Retrieve stored sessions from localStorage
const getStoredSessions = () => {
  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
};

// 2. Update or add a session to the "Vault"
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
    sessions[index] = sessionData; // Update existing tokens
  } else {
    sessions.push(sessionData); // Add new account
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

// 3. Filter so the CURRENT account doesn't show in the "Switch" list
const accountsToSwitchTo = computed(() => {
  const allSessions = getStoredSessions();
  if (!user.value) return allSessions;
  // Compare IDs to exclude current user
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
  // Optional: You could also remove the account from the vault here
  const { error } = await supabase.auth.signOut();
  isDropdownOpen.value = false;
  if (error) console.error('Sign out error:', error);
}

async function handleSwitchAccount(targetAccount) {
  // A. Save current session before switching
  const { data: { session: currentSession } } = await supabase.auth.getSession();
  if (currentSession) {
    updateVaultWithSession(currentSession);
  }

  // B. Load the new session
  const { error } = await supabase.auth.setSession({
    access_token: targetAccount.access_token,
    refresh_token: targetAccount.refresh_token
  });

  if (!error) {
    isDropdownOpen.value = false;
    // C. Navigate to the new profile and refresh state
    await router.push(`/profile/${targetAccount.user.id}`);
    window.location.reload();
  } else {
    console.error("Switch error:", error);
  }
}

async function handleAddNewAccount() {
  const { data: { session: currentSession } } = await supabase.auth.getSession();
  if (currentSession) {
    updateVaultWithSession(currentSession);
  }

  await supabase.auth.signOut(); // Sign out locally to trigger LoginRedirect
  isDropdownOpen.value = false;
  router.push('/login');
}
</script>

<template>
  <div class="account-dropdown-wrapper" ref="dropdownRef">
    <button @click="toggleDropdown" class="account-trigger">
      <div class="user-info">
        <img v-if="user?.user_metadata?.avatar_url" :src="user.user_metadata.avatar_url" class="trigger-avatar" />
        <div v-else class="trigger-avatar-placeholder"></div>
      </div>
      <svg :class="['arrow-icon', { 'rotated': isDropdownOpen }]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <div v-if="isDropdownOpen" class="account-menu">
      <div class="menu-section">
        <p class="section-label">Signed in as:</p>
        <div class="account-item active profile-link" @click.stop="goToProfile">
          <img :src="user?.user_metadata?.avatar_url || 'https://placehold.co/40'" class="item-avatar" />
          <div class="item-details">
            <span class="item-username">{{ user?.user_metadata?.username || 'User' }}</span>
            <span class="item-email">Go to Profile →</span>
          </div>
        </div>
      </div>

      <div v-if="accountsToSwitchTo.length > 0" class="menu-section">
        <p class="section-label">Switch Accounts</p>
        <div
            v-for="acc in accountsToSwitchTo"
            :key="acc.user.id"
            class="account-item switchable"
            @click.stop="handleSwitchAccount(acc)"
        >
          <img :src="acc.user.user_metadata?.avatar_url || 'https://placehold.co/40'" class="item-avatar" />
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
.account-dropdown-wrapper { position: relative; z-index: 9999; }
.account-menu { position: absolute; top: 100%; left: 0; width: 280px; background: #1a1a1a; border-radius: 12px; border: 1px solid #303030; margin-top: 10px; }
.account-trigger { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 8px 12px; background: #2a2a2a; border-radius: 25px; border: 1px solid #404040; cursor: pointer; }
.trigger-avatar { width: 32px; height: 32px; border-radius: 50%; }
.arrow-icon { width: 18px; transition: 0.2s; color: white; }
.arrow-icon.rotated { transform: rotate(180deg); }
.menu-section { padding: 8px 0; border-bottom: 1px solid #303030; }
.section-label { padding: 0 16px 8px; color: #888; font-size: 12px; }
.account-item { display: flex; align-items: center; padding: 10px 16px; cursor: pointer; }
.account-item:hover { background: #2a2a2a; }
.item-avatar { width: 36px; height: 36px; border-radius: 50%; margin-right: 12px; }
.item-details { display: flex; flex-direction: column; }
.item-username { font-weight: 600; font-size: 14px; color: white; }
.item-email { font-size: 11px; color: #888; }
.menu-button { width: 100%; text-align: left; padding: 10px 16px; background: none; border: none; color: white; cursor: pointer; }
.sign-out-button { color: #ff4444; }
</style>