FROM node:16 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN cp .env.template .env
COPY retrieveRMLMapper.sh ./
RUN ./retrieveRMLMapper.sh
ENTRYPOINT npm run serve
