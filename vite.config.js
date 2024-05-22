import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
const pathResolve = (dir) => resolve(__dirname, '.', dir);

// https://vitejs.dev/config/
export default defineConfig({
  base: '/we_match/',
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@', replacement: pathResolve('src') },
      { find: '*', replacement: pathResolve('./') }
    ],
  },
})
