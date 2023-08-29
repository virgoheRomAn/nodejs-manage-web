import { createApp } from 'vue';
import App from './App.vue';
import pinia from '/@/stores/index';
import router from '/@/router/index';
import application from '/@/application/index';

// 创建应用
const app = createApp(App);
app.use(pinia).use(router).use(application).mount('#app');
