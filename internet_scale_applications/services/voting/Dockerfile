FROM node:latest

WORKDIR /usr/src/app

COPY ./node/voter.js ./

RUN npm install mongodb

EXPOSE 3001

CMD ["node", "voter.js"]