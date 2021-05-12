FROM node:12-slim

WORKDIR /app

COPY . /app

RUN npm i
RUN npm link @becomes/cms-sdk

ENTRYPOINT [ "npm", "run", "dev" ]
