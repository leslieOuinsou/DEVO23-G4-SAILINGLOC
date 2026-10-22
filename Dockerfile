# SnapDeploy : API Node dans back/
FROM node:22-alpine
WORKDIR /app
COPY back/package*.json ./
RUN npm ci --omit=dev
COPY back/ .
ENV NODE_ENV=production
EXPOSE 8080
CMD ["npm", "start"]
