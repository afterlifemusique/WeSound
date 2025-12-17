<template>
  <div class="signin-page">
    <div class="signin-container">
      <form @submit.prevent="handleSignIn" class="signin-form">
        <div class="form-group">
          <label for="identifier">Username or Email</label>
          <input
              id="identifier"
              v-model="identifier"
              type="text"
              placeholder="Enter username or email"
              required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter password"
              required
          />
        </div>

        <button type="submit" :disabled="loading" class="signin-btn">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

        <a href="#" class="forgot-password">Forgot password?</a>

        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>

    <div class="signup-section">
      <span class="signup-text">New to WeSound?</span>
      <button @click="router.push('/signup')" class="signup-btn">Create Account</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/lib/supabase";

const router = useRouter();
const identifier = ref("");
const password = ref("");
const error = ref(null);
const loading = ref(false);

const SESSIONS_KEY = 'sb-multi-sessions';

const updateVaultWithSession = (session) => {
  if (!session) return;
  const data = localStorage.getItem(SESSIONS_KEY);
  const sessions = data ? JSON.parse(data) : [];
  const sessionData = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    user: session.user
  };
  const index = sessions.findIndex(s => s.user.id === session.user.id);
  if (index > -1) sessions[index] = sessionData;
  else sessions.push(sessionData);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

async function handleSignIn() {
  loading.value = true;
  error.value = null;

  try {
    let signinEmail = identifier.value;

    // Username lookup if no '@' is present
    if (!identifier.value.includes('@')) {
      const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .ilike('username', identifier.value)
          .single();

      if (profileError || !profile){
        console.error("Lookup Details:", profileError); // Add this line
        throw new Error("Username not found.");
      }
      signinEmail = profile.email;
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: signinEmail,
      password: password.value,
    });

    if (signInError) throw signInError;

    if (data.session) updateVaultWithSession(data.session);
    router.push('/');

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.signin-page {
  min-height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.signin-container {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.signin-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  background: #fff;
}

.form-group input::placeholder {
  color: #999;
}

.form-group input:focus {
  outline: none;
  border-color: #666;
}

.signin-btn {
  width: 100%;
  padding: 14px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 4px;
}

.signin-btn:hover:not(:disabled) {
  background: #1a1a1a;
}

.signin-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.forgot-password {
  font-size: 14px;
  color: #333;
  text-decoration: underline;
  align-self: flex-start;
  margin-top: -8px;
}

.forgot-password:hover {
  color: #000;
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin: -8px 0 0 0;
  padding: 12px;
  background: #ffebee;
  border-radius: 6px;
}

/* Signup section remains separate as it transitions to a different flow */
.signup-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
}

.signup-text {
  color: #fff;
  font-size: 15px;
}

.signup-btn {
  padding: 10px 24px;
  background: #b8860b;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.signup-btn:hover {
  background: #9a7009;
}
</style>