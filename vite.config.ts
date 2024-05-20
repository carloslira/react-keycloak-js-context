import path from 'node:path';

import {
  defineConfig,
} from 'vite';

import react from '@vitejs/plugin-react';

import dts from 'vite-plugin-dts';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint(),
    dts({
      rollupTypes: true,
    }),
  ],
  build: {
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      name: 'react-keycloak',
      entry: path.resolve(__dirname, './src/index.ts'),
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'keycloak-js',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'keycloak-js': 'Keycloak',
        },
      },
    },
  },
});
