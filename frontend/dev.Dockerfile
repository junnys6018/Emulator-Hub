FROM node:14

WORKDIR /code/frontend

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY ./ ./
COPY tsconfig-base.json ../tsconfig.json

CMD ["npm", "run", "dev"]