# Step 1: Build the Vite app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Pass environment variable at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build static assets
RUN npm run build

# Step 2: Use Nginx to serve static files
FROM nginx:latest

# Copy build output to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Custom Nginx config to handle SPA routing (important for React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
