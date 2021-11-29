FROM node:14

WORKDIR /code/frontend

COPY package* ./
RUN npm install

COPY ./ ./

CMD ["npm", "run", "dev"]