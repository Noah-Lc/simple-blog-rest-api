FROM node:8.11.2-alpine as node

# Set working directory.
RUN mkdir /frontend
WORKDIR /frontend

# Copy app dependencies.
COPY ./package*.json ./

RUN npm cache verify
# Install app dependencies.
RUN npm install

# Copy app files.
COPY .  /frontend
RUN npm run build
