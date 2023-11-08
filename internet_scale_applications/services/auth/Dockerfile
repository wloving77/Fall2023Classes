FROM node:latest

WORKDIR /usr/src/app

COPY ./node/auth.js ./

COPY ./node/package.json ./

RUN npm install

EXPOSE 3003

CMD ["node", "dailyBugle.js"]