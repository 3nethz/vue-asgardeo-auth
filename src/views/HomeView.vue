<script setup lang="ts">
import { auth } from "@/auth/authservice";
import { ref } from "vue";

const isAuthenticated = ref(false);
const user = ref({});

const handleAuthCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const sessionState = urlParams.get("session_state");
  const state = urlParams.get("state");

  if (code && sessionState && state) {
    try {
      const rawResponse = await auth.requestAccessToken(code, sessionState, state);
      if (typeof rawResponse === 'string') {
        try {
          const parsed = JSON.parse(rawResponse);
          console.log("Parsed Response:", parsed);
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
        }
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error("Error obtaining access token:", error);
      console.dir(error);
    }
  }
};

const login = async () => {
  try {
    const url = await auth.getAuthorizationURL();
    window.location.href = url;
  } catch (error) {
    console.error("Login Failed", error);
  }
};

const getUserInfo = async () =>{
  try {
    isAuthenticated.value = await auth.isAuthenticated();
    user.value = await auth.getBasicUserInfo();
    console.log(user);
  } catch (error) {
    console.error("Authentication Check Failed", error);
  }
}

window.addEventListener("load", handleAuthCallback);
window.addEventListener("load", getUserInfo)


</script>

<template>
  <main>
    <p>Hello</p>
    <!-- <TheWelcome /> -->
    <p v-if="isAuthenticated"> {{ user }}!</p>
    <button @click="login">Login</button>
    <button @click="getUserInfo"> User </button>
  </main>
</template>
