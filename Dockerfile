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
ENV PORT=$port

ARG db_host='localhost'
ENV DB_HOST=$db_host

ARG db_port=3360
ENV DB_PORT=$db_port

ARG db_username='root'
ENV DB_USERNAME=$db_username

ARG db_password='root'
ENV DB_PASSWORD=$db_password

ARG db_name='twitter'
ENV DB_NAME=$db_name

ARG service_email=''
ENV SERVICE_EMAIL=$service_email

ARG service_email_password=''
ENV SERVICE_EMAIL_PASSWORD=$service_email_password

ARG jwt_secret='secret'
ENV JWT_SECRET=$jwt_secret

EXPOSE $port
CMD [ "npm", "start" ]
