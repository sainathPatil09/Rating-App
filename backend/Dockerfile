FROM node:20 AS builder

WORKDIR /app

COPY . .

RUN npm install

#stage 2

FROM node:20-slim

WORKDIR /app

COPY --from=builder /app .

COPY . .

EXPOSE 5000

CMD ["npm", "start"]