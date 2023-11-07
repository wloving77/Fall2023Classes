FROM node:latest

WORKDIR /usr/src/app

COPY ./node/dailyBugle.js ./

COPY ./node/package.json ./

RUN npm install

EXPOSE 3002

CMD ["node", "dailyBugle.js"]