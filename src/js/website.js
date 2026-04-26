import { createApp } from 'vue';
import router from './website/router.js';
import WebsiteApp from './website/WebsiteApp.vue';

const app = createApp(WebsiteApp);
app.use(router);
app.mount('#website-app');
