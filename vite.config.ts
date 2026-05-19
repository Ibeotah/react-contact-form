import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"


// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
export default defineConfig({
  resolve: {
  alias: {
    '@components': path.resolve(__dirname, './src/components'),
    '@assets': path.resolve(__dirname, './src/assets'),
    '@styles': path.resolve(__dirname, './src/styles'),
    '@pages': path.resolve(__dirname, './src/pages'),
    '@constants': path.resolve(__dirname, './src/constants'),
    '@types': path.resolve(__dirname, './src/types'),
    '@routing': path.resolve(__dirname, './src/routing'),
    '@utils': path.resolve(__dirname, './src/utils'),
    '@hooks': path.resolve(__dirname, './src/hooks'),
    '@layout': path.resolve(__dirname, './src/layout'),
    '@lib': path.resolve(__dirname, './src/lib'),
  },
  },
  plugins: [react()],
  server: {
    host: true, 
    port: 5173, 
  },
});
