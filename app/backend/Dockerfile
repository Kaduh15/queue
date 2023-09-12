FROM node:18

WORKDIR /app-backend

RUN npm install -g npm@10.1.0

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]