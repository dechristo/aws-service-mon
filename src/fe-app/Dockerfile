FROM node:16.20-alpine AS frontend
WORKDIR web
COPY src/ src/
COPY node_modules/ node_modules/
COPY package.json .
COPY package-lock.json .
COPY angular.json .
COPY tsconfig.app.json .
COPY tsconfig.json .
EXPOSE 4200
ENTRYPOINT ["npx", "ng", "serve", "--host=0.0.0.0"]
