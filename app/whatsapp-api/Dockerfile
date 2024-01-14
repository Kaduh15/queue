FROM node:18

WORKDIR /app-whatsapp-api

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]