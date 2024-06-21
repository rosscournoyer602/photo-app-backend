FROM node:18
WORKDIR /app 
COPY package.json .
RUN npm install
RUN npm install -g typescript
COPY src ./src
COPY tsconfig.json ./tsconfig.json
RUN npm run build
EXPOSE 8080
CMD ["node", "./build/server.js"]