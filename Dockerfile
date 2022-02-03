FROM node:16 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN cp .env.template .env
ENTRYPOINT npm run serve
