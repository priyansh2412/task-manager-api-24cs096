FROM node:18

ENV NODE_OPTIONS=--experimental-global-webcrypto

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "app.js"]