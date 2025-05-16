# image ultra-légère production
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY ./dist ./dist
ENV NODE_ENV=production
CMD ["node","dist/app.js"]
