FROM node:latest

WORKDIR /usr/src/app

COPY ./node/dailyBugle.js ./

RUN npm install mongodb

RUN npm install bcryptjs

EXPOSE 3002

CMD ["node", "dailyBugle.js"]