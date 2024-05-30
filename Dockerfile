FROM node:latest

WORKDIR /godress-api

COPY . .

RUN rm -rf node_modules
RUN npm i

CMD ["npm", "start"]

EXPOSE 3000

