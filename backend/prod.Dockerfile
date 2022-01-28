FROM node:14

WORKDIR /code/backend

RUN npm install pm2 -g

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY ./ ./
COPY tsconfig-base.json ../tsconfig.json

RUN npm run build

EXPOSE 8000

CMD ["pm2-runtime", "npm", "--", "start"]