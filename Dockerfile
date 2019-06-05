FROM node:10 as builder
# Create app directory and copy package.json file
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
# copy source code and compile
COPY . .
RUN npm run build

# Bundle app
FROM node:10
COPY package*.json .
COPY --from=builder build .
ARG port=8080
ENV $PORT port
EXPOSE $PORT
CMD [ "npm", "start" ]
