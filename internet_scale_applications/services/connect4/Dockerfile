FROM node:latest

WORKDIR /usr/src/app

COPY ./node/connect4.js ./

RUN npm install express

EXPOSE 3000

CMD ["node", "connect4.js"]