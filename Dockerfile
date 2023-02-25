# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:16.17.0-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn && yarn run build

FROM nginx:stable-alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /app/build .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]