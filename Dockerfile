# /Dockerfile.dev
# DEV-шаблон: швидкий старт у WSL з hot-reload. 
# Залежності зручно ставити під час запуску через docker-compose (command).
# Образ короткий, без "важких" кроків на кшталт chown по всьому /app.

FROM node:20-bookworm-slim

ENV NODE_ENV=development \
    NEXT_TELEMETRY_DISABLED=1 \
    TZ=Europe/Warsaw

WORKDIR /app

# Мінімум системних утиліт: openssl для Prisma, nc для очікування БД
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates netcat-openbsd \
 && rm -rf /var/lib/apt/lists/*

# (Не ставимо npm ci тут, щоб не ламати кеш і не впиратися в workspaces/lock під час збірки)
# У деві код і node_modules зазвичай монтуються через volumes у docker-compose.

# Prisma: клієнт згенерується швидше, якщо схема вже скопійована
COPY prisma ./prisma
RUN npx prisma generate || true

# Копіюємо мінімум (у деві все одно монтуватиметься зверху bind-mount'ом)
COPY package*.json ./
COPY . .

EXPOSE 3000

# Команда для дев-режиму (можеш перекрити її у docker-compose.override.yml)
CMD ["npm", "run", "dev"]
