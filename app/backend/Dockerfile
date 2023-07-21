FROM node:18-alpine

WORKDIR /app-backend

COPY package.json .

RUN npm install --ignore-scripts

COPY . .

CMD [ "npm", "run", "dev" ]