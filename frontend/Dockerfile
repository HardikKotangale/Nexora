FROM node:20-alpine as build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source and build
COPY . .

# VITE_API_URL must be known at build time (Vite bakes env vars into the bundle)
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Serve with a simple static server
RUN npm install -g serve
EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
