# Dockerfile
FROM node:20-alpine

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN rm -f package-lock.json && \
    npm install && \
    npm cache clean --force

# Copy Prisma files INCLUDING SEED
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy application code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]