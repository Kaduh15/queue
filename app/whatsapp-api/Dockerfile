# Use uma imagem base oficial do Node.js
FROM node:20

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app-whatsapp-api

# Instale pnpm globalmente
RUN npm install -g pnpm

# Copie o package.json e o pnpm-lock.yaml (se existir)
COPY package.json ./

# Instale as dependências do projeto usando pnpm
RUN pnpm install

# Copie o restante dos arquivos do projeto
COPY . .

# Execute o build do projeto (se houver um script de build)
RUN pnpm run build

# Defina o comando padrão para iniciar o aplicativo
CMD [ "pnpm", "start" ]
