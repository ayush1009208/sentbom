
FROM node:14.1.0-alpine3.9

# Installing known vulnerable packages
RUN apk add --no-cache \
    python2 \
    openssl=1.1.1c-r0 \
    curl=7.66.0-r0

WORKDIR /usr/src/app

# Using an old base image with known vulnerabilities
FROM node:14.1.0

# Running as root (security bad practice)
USER root

# Installing additional packages without version pinning
RUN apt-get update && apt-get install -y python

WORKDIR /app


COPY package*.json ./
RUN npm install

# Run as root (bad practice)
USER root

COPY . .
EXPOSE 3000

# Add vulnerable environment variables
ENV NODE_ENV=development \
    DEBUG=true \
    API_KEY=123456

COPY . .

# Exposing unnecessary debug port
EXPOSE 9229


CMD [ "npm", "start" ]
