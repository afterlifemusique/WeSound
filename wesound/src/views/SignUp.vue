<template>
  <div class="signup-page">
    <div class="signup-container">
      <form @submit.prevent="signup" class="signup-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Choose a username"
              required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Your email"
              required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Create a password"
              required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm password"
              required
          />
        </div>

        <button type="submit" :disabled="loading" class="signup-btn">
          {{ loading ? 'Creating account...' : 'Sign Up' }}
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>

    <div class="login-section">
      <span class="login-text">Already have an account?</span>
      <button @click="$router.push('/login')" class="login-btn-bottom">Log In</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
// Import your signup function
// import { signUp } from "../api/auth.js";

const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref(null);
const loading = ref(false);

async function signup() {
  loading.value = true;
  error.value = null;

  // Validation
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    loading.value = false;
    return;
  }

  if (password.value.length < 6) {
    error.value = "Password must be at least 6 characters";
    loading.value = false;
    return;
  }

  // Your signup logic here
  // const { data, error: signUpError } = await signUp(email.value, password.value, username.value);

  // if (signUpError) {
  //   error.value = signUpError.message;
  // } else {
  //   router.push('/');
  // }

  loading.value = false;
}
</script>

<style scoped>
.signup-page {
  min-height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.signup-container {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.signup-form {
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

.signup-btn {
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

.signup-btn:hover:not(:disabled) {
  background: #1a1a1a;
}

.signup-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin: -8px 0 0 0;
  padding: 12px;
  background: #ffebee;
  border-radius: 6px;
}

.login-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
}

.login-text {
  color: #fff;
  font-size: 15px;
}

.login-btn-bottom {
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

.login-btn-bottom:hover {
  background: #9a7009;
}
</style>