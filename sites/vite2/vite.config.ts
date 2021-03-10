import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { inspectorServer } from 'react-dev-inspector/plugins/vite'
import { onlineDemoBuildPlugin } from './onlineDemoBuildPlugin'

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  resolve: {
    alias: {
      react: require.resolve('react'),
    },
  },
  plugins: [
    reactRefresh(),

    // only need onlineDemoBuildPlugin to prod build for online demo site
    onlineDemoBuildPlugin(),


    /**
     * react-dev-inspector example configuration is as follows
     */
    inspectorServer(),
  ],
})
