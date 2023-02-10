FROM node:16

COPY package.json package.json
COPY package-lock.json package-lock.json

WORKDIR /src
COPY . .

RUN npm install
RUN npm run build

EXPOSE 8080
CMD [ "npm", "run", "prod"]
