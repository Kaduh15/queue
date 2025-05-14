# Etapa base
FROM node:20-alpine AS base
WORKDIR /app-frontend
COPY package*.json ./

# Etapa de dependências
FROM base AS deps
RUN npm install

# Etapa de desenvolvimento
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app-frontend/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "dev"]

# Etapa de build (produção)
FROM base AS build
ENV NODE_ENV=production
COPY --from=deps /app-frontend/node_modules ./node_modules
COPY . .
RUN npm run build

# Etapa final para produção
FROM node:20-alpine AS prod
WORKDIR /app-frontend
ENV NODE_ENV=production
COPY --from=build /app-frontend/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev
CMD ["node", "dist/index.js"]
