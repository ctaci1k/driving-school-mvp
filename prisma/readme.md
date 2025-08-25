# 📚 **PRISMA SCHEMA МОДУЛЬНА АРХІТЕКТУРА**

## 📂 **Структура файлів:**

```
prisma/
├── schema.prisma          # Головний файл (імпортує всі модулі)
└── schema/
    ├── base.prisma        # Конфігурація БД
    ├── user.prisma        # Користувачі та автентифікація
    ├── student.prisma     # Студентські моделі
    ├── instructor.prisma  # Інструкторські моделі
    ├── booking.prisma     # Бронювання та розклад
    ├── payment.prisma     # Платежі та пакети
    ├── vehicle.prisma     # Транспорт та обслуговування
    ├── location.prisma    # Локації та філії
    └── enums.prisma       # Всі енуми

```

---

## 📄 **base.prisma - Базова конфігурація**

### **Призначення:**
Містить конфігурацію генератора та підключення до БД

### **Вміст:**
- `generator client` - налаштування Prisma Client
- `datasource db` - підключення до PostgreSQL

---

## 📄 **user.prisma - Користувачі**

### **Моделі:**

#### **User**
Основна модель користувача для всіх ролей

**Основні поля:**
- `id` - унікальний ідентифікатор
- `email` - електронна пошта (унікальна)
- `firstName`, `lastName` - ім'я та прізвище
- `phone` - телефон
- `role` - роль (STUDENT/INSTRUCTOR/ADMIN)
- `status` - статус (ACTIVE/INACTIVE/SUSPENDED)

**Додаткові поля:**
- `dateOfBirth` - дата народження
- `avatar` - URL аватара
- `emergencyContact`, `emergencyPhone` - екстрені контакти
- `address`, `city`, `postalCode` - адреса

**Налаштування:**
- `language` - мова інтерфейсу
- `emailNotifications`, `smsNotifications` - налаштування сповіщень

**Службові:**
- `createdAt`, `updatedAt` - дати створення/оновлення
- `lastLoginAt` - остання авторизація
- `deletedAt` - м'яке видалення

---

## 📄 **student.prisma - Студентські моделі**

### **Моделі:**

#### **StudentProfile**
Розширений профіль студента

**Поля:**
- `userId` - зв'язок з User
- `studentNumber` - унікальний номер студента
- `preferredInstructorId` - улюблений інструктор
- `learningStyle` - стиль навчання
- `specialNeeds` - особливі потреби

#### **StudentProgress**
Детальний прогрес навичок (0-100 для кожної)

**Навички паркування:**
- `parkingSkill` - загальна
- `parallelParking` - паралельне
- `perpendicularParking` - перпендикулярне
- `angleParking` - під кутом

**Навички водіння:**
- `cityDrivingSkill` - міське водіння
- `highwayDrivingSkill` - траса
- `nightDrivingSkill` - нічне водіння
- `weatherDriving` - складні погодні умови

**Знання:**
- `trafficRulesKnowledge` - ПДР
- `signRecognition` - розпізнавання знаків

**Статистика:**
- `totalHoursDriven` - всього годин
- `totalKmDriven` - всього км
- `lessonsCompleted` - завершено уроків

#### **Enrollment**
Зв'язок студента з навчальним пакетом

**Поля:**
- `userId`, `packageId` - зв'язки
- `status` - статус (ACTIVE/COMPLETED/PAUSED)
- `creditsTotal`, `creditsUsed`, `creditsRemaining` - кредити
- `lessonsTotal`, `lessonsCompleted` - уроки
- `startDate`, `endDate`, `expiresAt` - дати

#### **LessonFeedback**
Зворотній зв'язок після уроку

**Від інструктора:**
- `instructorRating` - оцінка студента
- `skillsAssessed` - оцінені навички (JSON)
- `areasOfImprovement` - що покращити
- `strengths` - сильні сторони

**Від студента:**
- `studentRating` - оцінка уроку
- `instructorRating` - оцінка інструктора

#### **Achievement & UserAchievement**
Система досягнень для гейміфікації

**Achievement:**
- `name`, `description` - назва та опис
- `category` - категорія (MILESTONE/SKILL/STREAK)
- `points` - бали
- `criteriaType`, `criteriaValue` - умови отримання

#### **ExamResult**
Результати іспитів

**Поля:**
- `type` - тип (THEORY/PRACTICAL)
- `score` - бал
- `passed` - здано/не здано
- `attemptNumber` - номер спроби

#### **StudentPreferences**
Налаштування студента

**Поля:**
- `preferredDays` - бажані дні
- `preferredTimeSlots` - бажаний час
- `learningPace` - темп навчання

---

## 📄 **instructor.prisma - Інструкторські моделі**

### **Моделі:**

#### **InstructorProfile**
Профіль інструктора

**Поля:**
- `licenseNumber` - номер ліцензії
- `licenseCategories` - категорії
- `yearsOfExperience` - досвід
- `specializations` - спеціалізації
- `rating` - рейтинг
- `successRate` - відсоток успішності

#### **InstructorSchedule**
Розклад інструктора

**Поля:**
- `dayOfWeek` - день тижня
- `startTime`, `endTime` - робочий час
- `bufferBefore`, `bufferAfter` - буфер між уроками

#### **ScheduleTemplate**
Шаблони розкладу

#### **ScheduleException**
Винятки в розкладі (відпустки, лікарняні)

---

## 📄 **booking.prisma - Бронювання**

### **Моделі:**

#### **Booking**
Бронювання уроку

**Основні поля:**
- `studentId`, `instructorId` - учасники
- `vehicleId`, `locationId` - транспорт та локація
- `startTime`, `endTime` - час
- `duration` - тривалість
- `lessonType` - тип уроку
- `status` - статус

**Фінансові:**
- `price` - ціна
- `isPaid` - оплачено
- `usedCredits` - використані кредити

---

## 📄 **payment.prisma - Платежі**

### **Моделі:**

#### **Package**
Навчальний пакет

**Поля:**
- `name`, `description` - назва та опис
- `credits` - кількість кредитів
- `price` - ціна
- `lessonsIncluded` - включено уроків
- `validityDays` - термін дії

#### **Payment**
Платіж

**Поля:**
- `amount` - сума
- `status` - статус
- `method` - метод оплати
- `p24SessionId` - Przelewy24 сесія

#### **UserPackage**
Придбаний пакет користувача

---

## 📄 **vehicle.prisma - Транспорт**

### **Моделі:**

#### **Vehicle**
Транспортний засіб

**Поля:**
- `registrationNumber` - реєстраційний номер
- `make`, `model`, `year` - марка, модель, рік
- `category` - категорія
- `transmission` - трансмісія
- `status` - статус

#### **MaintenanceLog**
Журнал обслуговування

---

## 📄 **location.prisma - Локації**

### **Моделі:**

#### **Location**
Філія/локація

**Поля:**
- `name`, `code` - назва та код
- `address`, `city` - адреса
- `maxInstructors`, `maxVehicles` - ліміти

---

## 📄 **enums.prisma - Енуми**

### **Всі переліки:**
- `UserRole` - ролі користувачів
- `UserStatus` - статуси користувачів
- `BookingStatus` - статуси бронювань
- `LessonType` - типи уроків
- `PaymentStatus` - статуси платежів
- І багато інших...

---
