import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

// Hash prototype.html content so CDN cache busts on every change
const protoSrc = path.resolve(__dirname, 'public/prototype.html')
const protoContent = fs.readFileSync(protoSrc)
const protoHash = crypto.createHash('md5').update(protoContent).digest('hex').slice(0, 8)
const protoFile = `prototype.${protoHash}.html`

export default defineConfig({
  base: '/MVP-Feedback-Intelligence--30th-May/',
  plugins: [
    react(),
    tailwindcss(),
    {
      // Copy prototype.html into dist with hashed filename
      name: 'prototype-hash',
      closeBundle() {
        const dest = path.resolve(__dirname, `dist/${protoFile}`)
        fs.copyFileSync(protoSrc, dest)
      },
    },
  ],
  define: {
    __BUILD_TIME__: JSON.stringify(Date.now()),
    __PROTO_FILE__: JSON.stringify(protoFile),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
