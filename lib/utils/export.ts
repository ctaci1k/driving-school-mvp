// lib/utils/export.ts

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Отримуємо заголовки з першого об'єкта
  const headers = Object.keys(data[0])
  
  // Створюємо CSV контент
  const csvContent = [
    // Заголовки
    headers.join(','),
    // Дані
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Екрануємо значення з комами або лапками
        if (value === null || value === undefined) return ''
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }).join(',')
    )
  ].join('\n')

  // Створюємо Blob з BOM для коректного відображення UTF-8 в Excel
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  
  // Створюємо посилання для завантаження
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Очищаємо URL
  URL.revokeObjectURL(url)
}

// Функція для форматування даних звіту студента
export function formatStudentReportForExport(students: any[]) {
  return students.map(student => ({
    'Ім\'я': student.name,
    'Email': student.email,
    'Телефон': student.phone || '-',
    'Статус': student.status,
    'Стадія навчання': student.stage,
    'Всього уроків': student.totalLessons,
    'Завершено уроків': student.completedLessons,
    'Скасовано уроків': student.cancelledLessons,
    'Прогрес (%)': student.progress,
    'Сплачено (PLN)': student.totalPaid,
    'Кредити': student.totalCredits,
    'Останній урок': student.lastLesson ? new Date(student.lastLesson).toLocaleDateString('uk-UA') : '-',
    'Дата реєстрації': new Date(student.createdAt).toLocaleDateString('uk-UA')
  }))
}

// Функція для форматування даних звіту інструктора
export function formatInstructorReportForExport(instructors: any[]) {
  return instructors.map(instructor => ({
    'Ім\'я': instructor.name,
    'Email': instructor.email,
    'Телефон': instructor.phone || '-',
    'Всього уроків': instructor.totalLessons,
    'Завершено уроків': instructor.completedLessons,
    'Скасовано уроків': instructor.cancelledLessons,
    'Майбутні уроки': instructor.upcomingLessons,
    'Відпрацьовано годин': instructor.totalHours,
    'Унікальних студентів': instructor.uniqueStudents,
    'Завантаженість (%)': instructor.utilization,
    'Дохід школі (PLN)': instructor.revenue,
    'Автомобілів': instructor.vehicles,
    'Рейтинг': instructor.rating?.toFixed(2) || '-',
    'Завершеність (%)': instructor.completionRate
  }))
}

// Функція для форматування історії уроків
export function formatLessonsForExport(lessons: any[]) {
  return lessons.map(lesson => ({
    'Дата': new Date(lesson.startTime).toLocaleDateString('uk-UA'),
    'Час': new Date(lesson.startTime).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
    'Тривалість (хв)': lesson.duration || 120,
    'Студент': lesson.student ? `${lesson.student.firstName} ${lesson.student.lastName}` : '-',
    'Інструктор': lesson.instructor ? `${lesson.instructor.firstName} ${lesson.instructor.lastName}` : '-',
    'Локація': lesson.location?.name || '-',
    'Автомобіль': lesson.vehicle ? `${lesson.vehicle.make} ${lesson.vehicle.model}` : '-',
    'Статус': lesson.status,
    'Оплата': lesson.payment?.amount || '-',
    'Використано кредитів': lesson.usedCredits || 0
  }))
}

// Функція для форматування платежів
export function formatPaymentsForExport(payments: any[]) {
  return payments.map(payment => ({
    'Дата': new Date(payment.createdAt).toLocaleDateString('uk-UA'),
    'Час': new Date(payment.createdAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
    'Тип': payment.booking ? 'Урок' : payment.userPackage ? 'Пакет' : 'Інше',
    'Опис': payment.description || '-',
    'Сума (PLN)': payment.amount,
    'Статус': payment.status,
    'Метод': payment.method || 'P24',
    'ID транзакції': payment.p24OrderId || '-'
  }))
}