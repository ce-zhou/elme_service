import { createApp } from "vue";
import App from "./App.vue";

import "./assets/main.css";

// 导入路由
import router from "./router/index";

import store from "./store/index";

// 引入socket.io-client
import io from "socket.io-client";
const app = createApp(App);
app.use(router);
app.use(store);

/* SocketIOClient.Socket, */
const socket = io("http://localhost:3000");
app.config.globalProperties.$socket = socket;
app.mount("#app");
