FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

COPY ./src ./src

ENV NODE_ENV=production

USER node

CMD ["npm", "start"]
