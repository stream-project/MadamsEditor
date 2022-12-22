FROM timbru31/java-node as build-stage

WORKDIR /app

# make wget available
RUN apt-get update && apt-get install -y wget

# Node
COPY package*.json ./
RUN npm install

# Prepare main dir
COPY ./ .
RUN cp .env.template .env
COPY retrieveRMLMapper.sh ./
RUN ./retrieveRMLMapper.sh
RUN mkdir temp

EXPOSE 7000

ENTRYPOINT npm run serve -- --port 7000
