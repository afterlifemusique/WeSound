<template>
  <div class="signup-page">
    <div class="signup-container">
      <form @submit.prevent="signup" class="signup-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" v-model="username" type="text" placeholder="Choose a username" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="Your email" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" placeholder="Create a password" required />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" v-model="confirmPassword" type="password" placeholder="Confirm password" required />
        </div>

        <button type="submit" :disabled="loading" class="signup-btn">
          {{ loading ? 'Creating account...' : 'Sign Up' }}
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>

    <div class="login-section">
      <span class="login-text">Already have an account?</span>
      <button @click="$router.push('/login')" class="login-btn">Log In</button>
    </div>
  </div>
</template>