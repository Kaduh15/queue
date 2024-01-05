import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'tsup',
  target: 'node18',
  entry: ['src/**/*.ts'],
  dts: true,
})
