import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// import { config, store, cryptoUtils } from "./auth/authservice";
// import { AsgardeoAuthClient } from "@asgardeo/auth-js";

// // Instantiate the AsgardeoAuthClient and pass the store object as an argument into the constructor.
// const auth = new AsgardeoAuthClient();

// // Initialize the instance with the config object.
// auth.initialize(config, store, cryptoUtils);

const app = createApp(App);

app.use(router);
// app.use(auth);
app.mount("#app");
