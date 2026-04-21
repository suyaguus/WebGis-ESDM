import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('leaflet')) return 'vendor-leaflet';
            if (id.includes('chart.js')) return 'vendor-chart';
            return 'vendor';
          }

          if (id.includes('/src/pages/superadmin/') || id.includes('/src/components/layout/superAdmin/')) {
            return 'role-superadmin';
          }

          if (id.includes('/src/pages/adminPerusahaan/') || id.includes('/src/components/layout/adminPerusahaan/')) {
            return 'role-admin-perusahaan';
          }

          if (id.includes('/src/pages/kadis/') || id.includes('/src/components/layout/Kadis/')) {
            return 'role-kadis';
          }

          if (id.includes('/src/pages/surveyor/') || id.includes('/src/components/layout/surveyor/')) {
            return 'role-surveyor';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
