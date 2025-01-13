import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        //proxy: {
        //    '/accounts': 'http://127.0.0.1:8000', // Proxy API requests to Django
        //},
    },
});