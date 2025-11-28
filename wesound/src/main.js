import { createApp } from "vue";
import { createPinia } from "pinia";
import { setupUserStoreSync} from "./store/user.js";
import router from "./router";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia()

app.use(router);
app.use(pinia);

setupUserStoreSync();

app.mount("#app");
