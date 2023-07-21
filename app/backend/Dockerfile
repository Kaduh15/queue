FROM node:18-alpine

WORKDIR /app-backend

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]