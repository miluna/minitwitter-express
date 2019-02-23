FROM node:10
# Create app directory and copy package.json file
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .
ARG port=8080
ENV $PORT port
EXPOSE $PORT

RUN npm start
