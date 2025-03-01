# Using an old base image with known vulnerabilities
FROM node:14.1.0

# Running as root (security bad practice)
USER root

# Installing additional packages without version pinning
RUN apt-get update && apt-get install -y python

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Exposing unnecessary debug port
EXPOSE 9229

CMD [ "npm", "start" ]
