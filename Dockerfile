FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm i 


ENV SERVER_PORT=3000
# 需要docker启动Mysql容器
ENV DATABASE_URL=mysql://root:root@localhost:3306/blog   
EXPOSE $SERVER_PORT
# ENTRYPOINT ["npm", "run"]
CMD ["npm", "run", "start"]

