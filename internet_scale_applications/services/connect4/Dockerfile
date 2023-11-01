FROM node:latest
WORKDIR /usr/src/app
COPY ./node/* ./
RUN npm install express
EXPOSE 3000
CMD ["node", "connect4.js"]