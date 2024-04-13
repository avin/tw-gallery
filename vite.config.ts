import react from '@vitejs/plugin-react';
import { URL, fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import localhostCerts from 'vite-plugin-localhost-certs';
import vitePluginDirectoryTree from './scripts/plugins/vite-plugin-directory-tree';

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [localhostCerts(), react(), vitePluginDirectoryTree()],
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
  },
  server: {
    host: '0.0.0.0',
    port: 8888,
  },
});
