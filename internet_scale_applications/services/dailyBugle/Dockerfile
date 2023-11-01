FROM node:latest

WORKDIR /usr/src/app

COPY ./node/dailyBugle.js ./

RUN npm install mongodb

EXPOSE 3002

CMD ["node", "dailyBugle.js"]