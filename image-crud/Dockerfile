# react-app/Dockerfile
FROM node:14

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .
ENV CHOKIDAR_USEPOLLING=true
RUN npm run build

CMD ["npm", "start"]
