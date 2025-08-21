// app/(admin)/admin-reports/page.tsx

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/layouts/navigation'
import { StatsCard } from '@/components/reports/StatsCard'
import { DateRangePicker } from '@/components/reports/DateRangePicker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
    Users,
    GraduationCap,
    Car,
    MapPin,
    TrendingUp,
    AlertCircle,
    DollarSign,
    Calendar,
    ChevronRight,
    Download,
    UserCheck,
    UserX
} from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { uk } from 'date-fns/locale'
import { trpc } from '@/lib/trpc/client'
import Link from 'next/link'
import {
    exportToCSV,
    formatStudentReportForExport,
    formatInstructorReportForExport
} from '@/lib/utils/export'

export default function AdminReportsPage() {
    const { data: session } = useSession()
    const [dateRange, setDateRange] = useState({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date())
    })

    // Запити даних
    const { data: stats } = trpc.adminReports.getOverallStats.useQuery({
        startDate: dateRange.start,
        endDate: dateRange.end
    })

    const { data: studentsReport } = trpc.adminReports.getStudentsReport.useQuery({
        startDate: dateRange.start,
        endDate: dateRange.end,
        status: 'ALL',
        limit: 5
    })

    const { data: instructorsReport } = trpc.adminReports.getInstructorsReport.useQuery({
        startDate: dateRange.start,
        endDate: dateRange.end,
        limit: 5
    })

    const { data: operationsReport } = trpc.adminReports.getOperationsReport.useQuery({
        startDate: dateRange.start,
        endDate: dateRange.end
    })

    const { data: topStudents } = trpc.adminReports.getTopStudents.useQuery({
        limit: 5
    })

    const { data: topInstructors } = trpc.adminReports.getTopInstructors.useQuery({
        limit: 5
    })

    // Функції експорту
    const handleExportOverall = () => {
        const data = {
            'Дата звіту': new Date().toLocaleDateString('uk-UA'),
            'Період': `${format(dateRange.start, 'dd.MM.yyyy')} - ${format(dateRange.end, 'dd.MM.yyyy')}`,
            'Всього студентів': stats?.students.total || 0,
            'Нових студентів': stats?.students.new || 0,
            'Активних студентів': stats?.students.active || 0,
            'Всього інструкторів': stats?.instructors.total || 0,
            'Активних інструкторів': stats?.instructors.active || 0,
            'Всього уроків': stats?.lessons.total || 0,
            'Завершено уроків': stats?.lessons.completed || 0,
            'Скасовано уроків': stats?.lessons.cancelled || 0,
            'Дохід (PLN)': stats?.finance.revenue || 0,
            'Очікується (PLN)': stats?.finance.pending || 0,
            'Всього автомобілів': stats?.vehicles.total || 0,
            'Активних автомобілів': stats?.vehicles.active || 0
        }
        exportToCSV([data], 'zagalnyj_zvit')
    }

    const handleExportStudents = () => {
        if (studentsReport?.students) {
            const formatted = formatStudentReportForExport(studentsReport.students)
            exportToCSV(formatted, 'zvit_studenty')
        }
    }

    const handleExportInstructors = () => {
        if (instructorsReport?.instructors) {
            const formatted = formatInstructorReportForExport(instructorsReport.instructors)
            exportToCSV(formatted, 'zvit_instruktory')
        }
    }


    return (
        <div className="min-h-screen bg-gray-50">
            {session && <Navigation userRole={session.user.role} />}

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Звіти адміністратора</h1>
                        <p className="text-gray-600">Повний огляд роботи автошколи</p>
                    </div>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={handleExportOverall}
                    >
                        <Download className="w-4 h-4" />
                        Експорт звіту
                    </Button>
                </div>

                {/* Вибір періоду */}
                <div className="mb-6">
                    <DateRangePicker
                        onDateChange={(start, end) => setDateRange({ start, end })}
                    />
                </div>

                {/* Основні метрики */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Студенти"
                        value={stats?.students.total || 0}
                        subtitle={`${stats?.students.new || 0} нових • ${stats?.students.active || 0} активних`}
                        icon={GraduationCap}
                    />
                    <StatsCard
                        title="Інструктори"
                        value={stats?.instructors.total || 0}
                        subtitle={`${stats?.instructors.active || 0} активних • ${stats?.instructors.utilization || 0}% завантаженість`}
                        icon={Users}
                    />
                    <StatsCard
                        title="Уроки"
                        value={stats?.lessons.total || 0}
                        subtitle={`${stats?.lessons.completed || 0} завершено • ${stats?.lessons.upcoming || 0} заплановано`}
                        icon={Calendar}
                    />
                    <StatsCard
                        title="Дохід"
                        value={`${stats?.finance.revenue || 0} PLN`}
                        subtitle={`Очікується: ${stats?.finance.pending || 0} PLN`}
                        icon={DollarSign}
                    />
                </div>

                {/* Показники ефективності */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Завершеність уроків</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {stats.lessons.completionRate}%
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: `${stats.lessons.completionRate}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Скасування уроків</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {stats.lessons.cancellationRate}%
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-red-600 h-2 rounded-full"
                                        style={{ width: `${stats.lessons.cancellationRate}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Використання автомобілів</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats.vehicles.utilization}%
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${stats.vehicles.utilization}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Таби з детальними звітами */}
                <Tabs defaultValue="students" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="students">Студенти</TabsTrigger>
                        <TabsTrigger value="instructors">Інструктори</TabsTrigger>
                        <TabsTrigger value="operations">Операції</TabsTrigger>
                        <TabsTrigger value="top">Топ рейтинги</TabsTrigger>
                    </TabsList>

                    <TabsContent value="students">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Звіт по студентах</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleExportStudents}
                                        className="flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Експорт CSV
                                    </Button>
                                    <Link href="/admin-reports/students">
                                        <Button variant="outline" size="sm">
                                            Детальний звіт
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                                <Link href="/admin-reports/students">
                                    <Button variant="outline" size="sm">
                                        Детальний звіт
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {studentsReport?.students.map((student) => (
                                        <div key={student.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{student.name}</p>
                                                    {student.isActive ? (
                                                        <span className="flex items-center gap-1 text-xs text-green-600">
                                                            <UserCheck className="w-3 h-3" />
                                                            Активний
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-xs text-gray-400">
                                                            <UserX className="w-3 h-3" />
                                                            Неактивний
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                    <span>{student.email}</span>
                                                    {student.phone && <span>{student.phone}</span>}
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                                    <span>Стадія: {student.stage}</span>
                                                    <span>Прогрес: {student.progress}%</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{student.completedLessons} уроків</p>
                                                <p className="text-sm text-gray-600">{student.totalPaid} PLN</p>
                                                {student.totalCredits > 0 && (
                                                    <p className="text-xs text-blue-600">{student.totalCredits} кредитів</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="instructors">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Звіт по інструкторах</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleExportInstructors}
                                        className="flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Експорт CSV
                                    </Button>
                                    <Link href="/admin-reports/instructors">
                                        <Button variant="outline" size="sm">
                                            Детальний звіт
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                                <Link href="/admin-reports/instructors">
                                    <Button variant="outline" size="sm">
                                        Детальний звіт
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {instructorsReport?.instructors.map((instructor) => (
                                        <div key={instructor.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                            <div className="flex-1">
                                                <p className="font-medium">{instructor.name}</p>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                    <span>{instructor.email}</span>
                                                    {instructor.phone && <span>{instructor.phone}</span>}
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                                    <span>Завантаженість: {instructor.utilization}%</span>
                                                    <span>Студентів: {instructor.uniqueStudents}</span>
                                                    <span>Рейтинг: ⭐ {instructor.rating.toFixed(1)}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{instructor.completedLessons} уроків</p>
                                                <p className="text-sm text-gray-600">{instructor.totalHours} год</p>
                                                <p className="text-xs text-green-600">{instructor.revenue} PLN дохід</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="operations">
                        <div className="space-y-6">
                            {/* Автомобілі */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Використання автомобілів</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {operationsReport?.vehicles.slice(0, 5).map((vehicle) => (
                                            <div key={vehicle.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Car className={`w-5 h-5 ${vehicle.status === 'ACTIVE' ? 'text-green-500' :
                                                        vehicle.status === 'MAINTENANCE' ? 'text-yellow-500' :
                                                            'text-red-500'
                                                        }`} />
                                                    <div>
                                                        <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                                                        <p className="text-sm text-gray-600">{vehicle.registrationNumber}</p>
                                                    </div>
                                                    {vehicle.needsAttention && (
                                                        <AlertCircle className="w-4 h-4 text-orange-500" />
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">{vehicle.lessonsCount} уроків</p>
                                                    <p className="text-xs text-gray-500">{vehicle.hoursUsed.toFixed(1)} год</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Локації */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Використання локацій</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {operationsReport?.locations.map((location) => (
                                            <div key={location.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="w-5 h-5 text-blue-500" />
                                                    <div>
                                                        <p className="font-medium">{location.name}</p>
                                                        <p className="text-sm text-gray-600">{location.city}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">{location.bookingsCount} бронювань</p>
                                                    <p className="text-xs text-gray-500">{location.utilization}% завантаженість</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Популярні часи */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Популярні часи для уроків</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {operationsReport?.peakHours.map((hour) => (
                                            <div key={hour.hour} className="flex items-center justify-between">
                                                <span className="text-sm">{hour.hour}:00 - {hour.hour + 1}:00</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${(hour.count / (operationsReport.peakHours[0]?.count || 1)) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-600 w-12 text-right">{hour.count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="top">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Топ студентів */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                        Топ студентів
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {topStudents?.map((student, index) => (
                                            <div key={student.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-bold text-gray-400 w-6">
                                                        {index + 1}
                                                    </span>
                                                    <div>
                                                        <p className="font-medium">{student.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {student.completedLessons} уроків • {student.totalPaid} PLN
                                                        </p>
                                                    </div>
                                                </div>
                                                {index === 0 && <span className="text-xl">🏆</span>}
                                                {index === 1 && <span className="text-xl">🥈</span>}
                                                {index === 2 && <span className="text-xl">🥉</span>}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Топ інструкторів */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-blue-500" />
                                        Топ інструкторів
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {topInstructors?.map((instructor, index) => (
                                            <div key={instructor.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-bold text-gray-400 w-6">
                                                        {index + 1}
                                                    </span>
                                                    <div>
                                                        <p className="font-medium">{instructor.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {instructor.completedLessons} уроків • {instructor.revenue} PLN дохід
                                                        </p>
                                                    </div>
                                                </div>
                                                {index === 0 && <span className="text-xl">🏆</span>}
                                                {index === 1 && <span className="text-xl">🥈</span>}
                                                {index === 2 && <span className="text-xl">🥉</span>}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}