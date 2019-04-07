FROM node:8.11.2-alpine as node

# Set working directory.
RUN mkdir /frontend
WORKDIR /frontend

# Copy app dependencies.
COPY ./package*.json ./

RUN npm cache verify
# Install app dependencies.
RUN npm install

COPY ./start_dev.sh /
RUN dos2unix /start_dev.sh

# Copy app files.
COPY .  /frontend

EXPOSE 4200
CMD ["sh", "start_dev.sh"]
