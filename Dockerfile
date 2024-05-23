FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm i
ENV SERVER_PORT=3000
EXPOSE $SERVER_PORT
CMD ["npm", "run", "start"]
