# Dockerfile
FROM node:20-alpine

# Install dependencies for Prisma and PostgreSQL client
RUN apk add --no-cache libc6-compat openssl netcat-openbsd

WORKDIR /app

# Спочатку копіюємо тільки package files для кешування залежностей
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (змінити npm ci на npm install)
# Цей шар буде кешуватись, якщо package.json не змінювався
RUN npm install && \
    npm cache clean --force

# Generate Prisma Client
# Це також буде кешуватись, якщо schema.prisma не змінювалась
RUN npx prisma generate

# Тільки після встановлення залежностей копіюємо решту коду
# Copy ALL application code (включно з package files)
COPY . .

# Створюємо папку .next і встановлюємо права ПЕРЕД зміною користувача
RUN mkdir -p .next && \
    chown -R node:node /app

EXPOSE 3000

# Закоментовано для dev режиму - розкоментуйте для production
# USER node

CMD ["npm", "run", "dev"]