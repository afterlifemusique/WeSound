<script setup>
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabase'; // Assuming Supabase client is here
import { useUserStore } from '@/store/user'; // Assuming your current user store

// --- STATE MANAGEMENT ---
const userStore = useUserStore();
// Use the currently active user and a list of other available sessions/accounts
const currentUser = computed(() => userStore.user);

// Dummy data for demonstration. In a real app, this would come from a Supabase
// mechanism for tracking multiple signed-in sessions (e.g., local storage/indexedDB or a custom store).
const availableAccounts = ref([
  { id: 'uuid-1', username: 'pro_artist', email: 'pro@example.com', avatar_url: 'https://placehold.co/40x40/B8860B/white' },
  { id: 'uuid-2', username: 'tester_dev', email: 'test@example.com', avatar_url: 'https://placehold.co/40x40/404040/white' }
]);

// --- DROPDOWN LOGIC ---
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

// Function to close the dropdown when clicking outside (Best Practice)
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
}

// Attach and detach click listener when component mounts/unmounts
import { onMounted, onUnmounted } from 'vue';
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// --- ACTION HANDLERS ---

async function handleSignOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    // Handle error display
  }
  // Update store (your setupUserStoreSync should handle this automatically)
  isDropdownOpen.value = false;
  // Optional: Redirect to homepage/login page
}

async function handleSwitchAccount(accountId) {
  console.log('Switching to account:', accountId);
  // TODO: Implement actual Supabase session switching logic (requires managing tokens/sessions)
  // For a basic app, this often means signing out the current user and signing in the target user.
  isDropdownOpen.value = false;
}

function handleAddNewAccount() {
  console.log('Redirecting to login for new account');
  // TODO: Redirect to your login/signup page
  isDropdownOpen.value = false;
}

// Filter the accounts to show only those not currently active
const accountsToSwitchTo = computed(() => {
  if (!currentUser.value) return availableAccounts.value;
  return availableAccounts.value.filter(account => account.id !== currentUser.value.id);
});
</script>
<template>
  <div class="account-dropdown-wrapper" ref="dropdownRef">
    <button @click="toggleDropdown" class="account-trigger" aria-expanded="true" aria-controls="account-menu">
      <div class="user-info">
        <img v-if="currentUser?.avatar_url" :src="currentUser.avatar_url" alt="User Avatar" class="trigger-avatar" />
        <div v-else class="trigger-avatar-placeholder"></div>
      </div>
      <svg :class="['arrow-icon', { 'rotated': isDropdownOpen }]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <div v-if="isDropdownOpen" id="account-menu" class="account-menu" role="menu" aria-label="Account options">

      <div class="menu-section current-user-section">
        <p class="section-label">Signed in as:</p>
        <div class="account-item active">
          <img :src="currentUser?.avatar_url" alt="Current Avatar" class="item-avatar" />
          <div class="item-details">
            <span class="item-username">{{ currentUser?.email || 'Unknown User' }}</span>
            <span class="item-email">Active Session</span>
          </div>
        </div>
      </div>

      <div v-if="accountsToSwitchTo.length > 0" class="menu-section switch-account-section">
        <p class="section-label">Switch Accounts</p>
        <div
            v-for="account in accountsToSwitchTo"
            :key="account.id"
            class="account-item switchable"
            @click="handleSwitchAccount(account.id)"
            role="menuitem"
        >
          <img :src="account.avatar_url" :alt="account.username" class="item-avatar" />
          <div class="item-details">
            <span class="item-username">{{ account.username }}</span>
            <span class="item-email">{{ account.email }}</span>
          </div>
        </div>
      </div>

      <div class="menu-section actions-section">
        <button @click="handleAddNewAccount" class="menu-button" role="menuitem">
          + Add New Account
        </button>
        <button @click="handleSignOut" class="menu-button sign-out-button" role="menuitem">
          Sign Out
        </button>
      </div>

    </div>
  </div>
</template>
<style scoped>
.account-dropdown-wrapper {
  position: relative;
  display: inline-block;
  z-index: 1000; /* Ensure the menu is above other content */
}

/* --- TRIGGER BUTTON --- */
.account-trigger {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 25px;
  background: #2a2a2a; /* Dark background */
  color: #fff;
  border: 1px solid #404040;
  cursor: pointer;
  transition: background 0.2s;
}

.account-trigger:hover {
  background: #353535;
}

.user-info {
  display: flex;
  align-items: center;
}

.trigger-avatar, .trigger-avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.trigger-avatar-placeholder {
  background-color: #b8860b; /* Golden color placeholder */
}

.arrow-icon {
  width: 18px;
  height: 18px;
  margin-left: 8px;
  transition: transform 0.2s;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}

/* --- DROPDOWN MENU --- */
.account-menu {
  position: absolute;
  top: 100%; /* Position below the trigger */
  left: 0;
  width: 280px;
  background: #1a1a1a;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  padding: 10px 0;
  margin-top: 10px;
  border: 1px solid #303030;
}

.menu-section {
  padding: 8px 0;
  border-bottom: 1px solid #303030;
}

.menu-section:last-child {
  border-bottom: none;
}

.section-label {
  padding: 0 16px 8px;
  color: #888;
  font-size: 13px;
  font-weight: 500;
  margin: 0;
}

/* --- ACCOUNT ITEMS --- */
.account-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
}

.account-item.switchable {
  cursor: pointer;
  transition: background 0.1s;
}

.account-item.switchable:hover {
  background: #2a2a2a;
}

.item-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.account-item.active .item-avatar {
  border: 2px solid #b8860b; /* Highlight active account */
}

.item-details {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.item-username {
  font-weight: 600;
  font-size: 15px;
}

.item-email {
  color: #888;
  font-size: 12px;
}

/* --- BUTTONS --- */
.menu-button {
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.1s;
}

.menu-button:hover {
  background: #2a2a2a;
}

.sign-out-button {
  color: #f44336; /* Red for sign-out action */
}

.sign-out-button:hover {
  background: #2a2a2a;
}
</style>