# This Dockerfile is used to build a production image for deployment purposes
# Commands without docker-compose:
# Command to build the image: docker build -t (image name:tag) .
# Command to run the image: docker run -p 3000:3000 --env-file (env file name) (image name:tag)

# Use the official Node.js image as the base image
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Setup production image
# Trigger deployment
FROM base AS runner
ENV NODE_ENV=production

# Install curl and other necessary packages for debugging purposes
RUN apk add --no-cache libc6-compat vips-dev gcc g++ make python3 curl

# Copy necessary files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/ ./.next/
COPY next.config.mjs ./next.config.mjs

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Expose the port the app runs on
EXPOSE 3000

# Set the command to run the app
CMD ["yarn", "start"]