FROM node:14

WORKDIR /code/backend

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY ./ ./

EXPOSE 8000

CMD ["npm", "run", "dev"]