FROM node:16.17-alpine

ADD . /app

WORKDIR /app

RUN npm install

CMD ["npm", "run", "start"]

