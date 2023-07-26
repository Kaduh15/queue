import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  sourcemap: true,
  clean: true,
  dts: true,
  minify: true,
})
