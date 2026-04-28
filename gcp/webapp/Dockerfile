FROM node:22.12-alpine AS build-env

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22.12-alpine AS runtime

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build-env /app/dist ./dist
COPY --from=build-env /app/server.cjs ./server.cjs

ENV NODE_ENV=production
EXPOSE 8080

CMD ["npm", "run", "start"]
