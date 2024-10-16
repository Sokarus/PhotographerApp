# Строим приложение на React
FROM node:18-alpine as build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./

ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# RUN npm run build

CMD ["npm", "start"]
