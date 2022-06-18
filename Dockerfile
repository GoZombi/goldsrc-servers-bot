# syntax=docker/dockerfile:1

FROM node:18.0.0
ENV NODE_ENV=production

WORKDIR /app

# COPY ["package.json", "package-lock.json*", "./"]

COPY . .

RUN npm install --production

CMD [ "node", "src/index.js" ]
