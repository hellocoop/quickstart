# vite image used during dev to enable HMR 
FROM node:20-alpine
WORKDIR /usr/src/quickstart
COPY ["*.json", "*.js", "*.cjs", "index.html", "./"]
RUN npm i
EXPOSE 7002
