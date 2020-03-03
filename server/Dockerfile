FROM node:13.8.0

COPY . /server

ENV PATH /server/node_modules/.bin:$PATH

WORKDIR /server

RUN npm install

CMD ["node", "server.js"]
