FROM node:18

WORKDIR /app-whatsapp-api

RUN npm install npm@latest -g

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "dev" ]