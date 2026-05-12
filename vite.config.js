import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 5174,
        historyApiFallback: true,
    },
    preview: {
        port: 5174,
        historyApiFallback: true,
    },
    build: {
        target: 'es2020',
        cssCodeSplit: true,
        chunkSizeWarningLimit: 800,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('three')) return 'three';
                        if (id.includes('gsap'))  return 'gsap';
                        if (id.includes('vue') || id.includes('@vue')) return 'vue';
                    }
                },
            },
        },
    },
});
