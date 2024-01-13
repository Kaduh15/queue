FROM node:18

WORKDIR /app-whatsapp-api

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]