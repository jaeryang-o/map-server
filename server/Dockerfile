FROM node:alpine

ADD . /app


RUN yarn install
WORKDIR /app

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/yarn", "run", "start"]
