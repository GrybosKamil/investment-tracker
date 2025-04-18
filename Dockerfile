FROM node:23-slim

WORKDIR /app

COPY package.json ./
COPY client/package.json client/package-lock.json ./client/
COPY server/package.json server/package-lock.json ./server/

ENV NPM_CONFIG_FETCH_TIMEOUT=360000
ENV NPM_CONFIG_FETCH_RETRIES=10

RUN npm run install:client
RUN npm run install:server
RUN npm install

COPY client ./client
COPY server ./server

RUN npm run build 

EXPOSE 3000

CMD ["npm", "start"]