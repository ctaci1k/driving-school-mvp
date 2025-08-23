# 🚀 Швидка інструкція налаштування проекту Driving School

## 📦 1. ПОЧАТКОВЕ НАЛАШТУВАННЯ (новий проект або після clone)

```bash
# 1. Встановити всі залежності
npm install

# 2. Створити .env файл (якщо немає)
cp .env.example .env

# 3. Запустити базу даних в Docker
docker-compose up -d

# 4. Створити таблиці в базі
npm run db:push
# АБО якщо є міграції
npm run db:migrate

# 5. Згенерувати Prisma Client
npm run db:generate

# 6. Заповнити базу тестовими даними
npm run db:seed:fresh
```

## 🔄 2. ОНОВЛЕННЯ ЗАЛЕЖНОСТЕЙ (після зміни package.json)

```bash
# Варіант 1: Швидке оновлення
npm install

# Варіант 2: Чисте оновлення (рекомендовано)
rm -rf node_modules package-lock.json
npm install
npm run db:generate
```

## 🗄️ 3. РОБОТА З БАЗОЮ ДАНИХ

### Повне перезавантаження бази:
```bash
# Видалити всі дані + створити нові таблиці + заповнити даними
npm run db:reset:seed

# Те саме, але з мінімальними даними (швидше)
npm run db:reset:minimal
```

### Тільки оновити дані (без видалення структури):
```bash
# Очистити дані і заповнити заново
npm run db:seed:fresh

# Додати дані до існуючих (може бути дублювання)
npm run db:seed

# Мінімальний набір даних для швидких тестів
npm run db:seed:minimal
```

### Перегляд бази:
```bash
# Відкрити візуальний редактор бази
npm run db:studio
```

## 🛠️ 4. ЩОДЕННА РОБОТА

### Запуск проекту:
```bash
# 1. Запустити базу (якщо не запущена)
docker-compose up -d

# 2. Запустити dev сервер
npm run dev

# 3. В іншому терміналі - Prisma Studio (опціонально)
npm run db:studio
```

### Після змін в схемі Prisma:
```bash
# Варіант 1: Швидко (без міграцій)
npm run db:push

# Варіант 2: З міграціями (для production)
npm run db:migrate
```

## 🧪 5. ТЕСТУВАННЯ РІЗНИХ СЦЕНАРІЇВ

```bash
# Тестувати тільки конкретний модуль
node prisma/seed/index.js --only users
node prisma/seed/index.js --only bookings
node prisma/seed/index.js --only payments

# Перевірити статистику бази
node prisma/seed/index.js --no-stats
```

## 🚨 6. ВИРІШЕННЯ ПРОБЛЕМ

### Якщо база не працює:
```bash
# Перезапустити Docker
docker-compose down
docker-compose up -d

# Перевірити чи працює PostgreSQL
docker ps
docker logs driving-school-db
```

### Якщо Prisma не генерується:
```bash
# Очистити кеш Prisma
rm -rf node_modules/.prisma
npm run db:generate
```

### Якщо seed не працює:
```bash
# Перевірити структуру бази
npm run db:push

# Запустити з логами
node prisma/seed/index.js --fresh 2>&1 | tee seed.log
```

### Повний reset (ядерна опція 💣):
```bash
# Видалити ВСЕ і почати з нуля
docker-compose down -v
rm -rf node_modules package-lock.json .next
npm install
docker-compose up -d
sleep 5  # Почекати поки база запуститься
npm run db:push
npm run db:seed:fresh
npm run dev
```

## 📝 7. ТЕСТОВІ ЛОГІНИ

Після виконання seed використовуйте:

```
🔑 Пароль для всіх: Test123!

Admin:      admin@drivingschool.pl
Manager:    manager@drivingschool.pl
Instructor: piotr.instructor@drivingschool.pl
Student:    jan.kowalczyk@gmail.com
```

## 🎯 8. ШВИДКІ КОМАНДИ (копіюй-вставляй)

### Початок роботи (ранок):
```bash
docker-compose up -d && npm run dev
```

### Свіжі дані для тестування:
```bash
npm run db:seed:fresh && npm run dev
```

### Повний перезапуск:
```bash
npm run db:reset:seed && npm run dev
```

### Кінець дня (вимкнути все):
```bash
docker-compose down
```

## 💡 ПОРАДИ

1. **Завжди** запускайте `docker-compose up -d` перед роботою
2. **Використовуйте** `db:seed:minimal` для швидких тестів
3. **Зберігайте** .env.local для локальних налаштувань
4. **Перевіряйте** логи Docker якщо база не працює
5. **Робіть** backup бази перед великими змінами

---

**Зберігай цей файл як `DEV-GUIDE.md` в корені проекту!** 📌