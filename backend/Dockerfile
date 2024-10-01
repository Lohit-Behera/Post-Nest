FROM node:20.12.2

WORKDIR /backend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]