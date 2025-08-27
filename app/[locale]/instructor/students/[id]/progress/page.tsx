// /app/[locale]/instructor/students/[id]/progress/page.tsx

'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
 TrendingUp, Target, Award, Star, Clock, Calendar,
 CheckCircle, XCircle, AlertCircle, ChevronRight,
 Save, Download, Share, MessageSquare, FileText,
 Car, Users, BookOpen, Navigation, Gauge, Brain
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
 LineChart, Line, AreaChart, Area, RadarChart, PolarGrid,
 PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
 XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'

export default function StudentProgressPage() {
 const params = useParams()
 const router = useRouter()
 const studentId = params?.id as string

 const [feedbackText, setFeedbackText] = useState('')
 const [selectedSkills, setSelectedSkills] = useState<Record<string, number>>({})

 const student = {
   id: studentId,
   name: 'Maria Kowalska',
   avatar: 'https://ui-avatars.com/api/?name=MK&background=10B981&color=fff',
   phone: '+48501234569',
   email: 'maria.k@email.com',
   joinedDate: '2024-01-05',
   category: 'B',
   instructor: 'Piotr Nowak',
   
   overallProgress: 85,
   theoryProgress: 95,
   practiceProgress: 78,
   examReadiness: 82,
   
   totalLessons: 28,
   completedLessons: 24,
   remainingLessons: 4,
   totalHours: 36,
   
   averageRating: 4.8,
   lastLessonRating: 5,
   improvementRate: 15,
   
   skills: {
     'Znajomość przepisów': 95,
     'Parkowanie': 70,
     'Manewrowanie': 85,
     'Jazda w mieście': 88,
     'Jazda trasą': 75,
     'Jazda nocna': 60,
     'Hamowanie awaryjne': 80,
     'Zachowanie dystansu': 90,
     'Używanie lusterek': 85,
     'Prędkość': 92
   },
   
   weakPoints: [
     { skill: 'Parkowanie równoległe', level: 3, improvement: '+10%' },
     { skill: 'Jazda nocna', level: 2, improvement: '+5%' },
     { skill: 'Cofanie', level: 3, improvement: '+15%' }
   ],
   
   strongPoints: [
     { skill: 'Znajomość przepisów', level: 5, stable: true },
     { skill: 'Przestrzeganie zasad', level: 5, stable: true },
     { skill: 'Pewna jazda', level: 4, stable: true }
   ],
   
   milestones: [
     { id: 1, title: 'Pierwsza lekcja', date: '05.01.2024', completed: true },
     { id: 2, title: '10 godzin praktyki', date: '20.01.2024', completed: true },
     { id: 3, title: 'Teoria zdana', date: '25.01.2024', completed: true },
     { id: 4, title: 'Jazda miejska opanowana', date: '30.01.2024', completed: true },
     { id: 5, title: 'Gotowość do egzaminu', date: '10.02.2024', completed: false },
     { id: 6, title: 'Egzamin praktyczny', date: '12.02.2024', completed: false }
   ],
   
   examPrediction: {
     theoryPass: 95,
     practicePass: 78,
     recommendedLessons: 3,
     readyDate: '10 lutego 2024'
   }
 }

 const progressHistory = [
   { week: 'Tydzień 1', progress: 15 },
   { week: 'Tydzień 2', progress: 30 },
   { week: 'Tydzień 3', progress: 45 },
   { week: 'Tydzień 4', progress: 60 },
   { week: 'Tydzień 5', progress: 72 },
   { week: 'Tydzień 6', progress: 85 }
 ]

 const skillsRadarData = Object.entries(student.skills).map(([skill, value]) => ({
   skill: skill.length > 15 ? skill.substring(0, 15) + '...' : skill,
   value
 }))

 const lessonHistory = [
   {
     id: 1,
     date: '03.02.2024',
     type: 'Przygotowanie do egzaminu',
     duration: 90,
     rating: 5,
     skills: ['Trasa egzaminacyjna', 'Hamowanie awaryjne'],
     notes: 'Świetnie! Gotowa do egzaminu'
   },
   {
     id: 2,
     date: '01.02.2024',
     type: 'Praktyka - miasto',
     duration: 90,
     rating: 4,
     skills: ['Parkowanie', 'Skrzyżowania'],
     notes: 'Poprawa w parkowaniu równoległym'
   },
   {
     id: 3,
     date: '29.01.2024',
     type: 'Praktyka - trasa',
     duration: 120,
     rating: 5,
     skills: ['Wyprzedzanie', 'Prędkość'],
     notes: 'Pewna jazda po trasie'
   }
 ]

 const handleSaveFeedback = () => {
   console.log('Saving feedback:', feedbackText)
   console.log('Skills assessment:', selectedSkills)
 }

 const handleGenerateReport = () => {
   console.log('Generating report for student:', studentId)
 }

 return (
   <div className="space-y-6">
     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
       <div className="flex items-center gap-4">
         <Avatar className="h-16 w-16">
           <AvatarImage src={student.avatar} />
           <AvatarFallback>{student.name[0]}</AvatarFallback>
         </Avatar>
         <div>
           <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
           <p className="text-gray-600">Kategoria {student.category} • Dołączył {student.joinedDate}</p>
         </div>
       </div>
       <div className="flex gap-2">
         <Button variant="outline">
           <MessageSquare className="w-4 h-4 mr-2" />
           Wiadomość
         </Button>
         <Button variant="outline">
           <Download className="w-4 h-4 mr-2" />
           Eksport
         </Button>
         <Button onClick={handleGenerateReport}>
           <FileText className="w-4 h-4 mr-2" />
           Raport
         </Button>
       </div>
     </div>

     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
       <Card>
         <CardContent className="p-4">
           <div className="flex items-center justify-between mb-2">
             <p className="text-sm text-gray-500">Postęp ogólny</p>
             <TrendingUp className="w-4 h-4 text-green-500" />
           </div>
           <p className="text-2xl font-bold">{student.overallProgress}%</p>
           <Progress value={student.overallProgress} className="h-2 mt-2" />
         </CardContent>
       </Card>

       <Card>
         <CardContent className="p-4">
           <div className="flex items-center justify-between mb-2">
             <p className="text-sm text-gray-500">Gotowość do egzaminu</p>
             <Target className="w-4 h-4 text-blue-500" />
           </div>
           <p className="text-2xl font-bold">{student.examReadiness}%</p>
           <Progress value={student.examReadiness} className="h-2 mt-2" />
         </CardContent>
       </Card>

       <Card>
         <CardContent className="p-4">
           <div className="flex items-center justify-between mb-2">
             <p className="text-sm text-gray-500">Ukończone lekcje</p>
             <Calendar className="w-4 h-4 text-purple-500" />
           </div>
           <p className="text-2xl font-bold">{student.completedLessons}/{student.totalLessons}</p>
           <p className="text-xs text-gray-500">{student.totalHours} godzin</p>
         </CardContent>
       </Card>

       <Card>
         <CardContent className="p-4">
           <div className="flex items-center justify-between mb-2">
             <p className="text-sm text-gray-500">Średnia ocena</p>
             <Star className="w-4 h-4 text-yellow-500" />
           </div>
           <p className="text-2xl font-bold">{student.averageRating}</p>
           <div className="flex gap-0.5 mt-2">
             {[1, 2, 3, 4, 5].map((star) => (
               <Star
                 key={star}
                 className={`w-3 h-3 ${
                   star <= Math.round(student.averageRating)
                     ? 'fill-yellow-400 text-yellow-400'
                     : 'text-gray-300'
                 }`}
               />
             ))}
           </div>
         </CardContent>
       </Card>
     </div>

     <Alert className="border-blue-200 bg-blue-50">
       <AlertCircle className="h-4 w-4 text-blue-600" />
       <AlertDescription>
         <div className="flex items-center justify-between">
           <div>
             <p className="font-semibold text-blue-900">Prognoza gotowości do egzaminu</p>
             <p className="text-sm text-blue-700 mt-1">
               Teoria: {student.examPrediction.theoryPass}% • Praktyka: {student.examPrediction.practicePass}%
             </p>
             <p className="text-sm text-blue-600 mt-1">
               Zalecane jeszcze {student.examPrediction.recommendedLessons} lekcje do {student.examPrediction.readyDate}
             </p>
           </div>
           <Button size="sm" variant="outline" className="ml-4">
             Zaplanuj egzamin
           </Button>
         </div>
       </AlertDescription>
     </Alert>

     <Tabs defaultValue="skills" className="w-full">
       <TabsList className="grid w-full grid-cols-4">
         <TabsTrigger value="skills">Umiejętności</TabsTrigger>
         <TabsTrigger value="progress">Postęp</TabsTrigger>
         <TabsTrigger value="history">Historia</TabsTrigger>
         <TabsTrigger value="feedback">Ocena</TabsTrigger>
       </TabsList>

       <TabsContent value="skills" className="mt-6 space-y-6">
         <Card>
           <CardHeader>
             <CardTitle>Macierz umiejętności</CardTitle>
           </CardHeader>
           <CardContent>
             <ResponsiveContainer width="100%" height={300}>
               <RadarChart data={skillsRadarData}>
                 <PolarGrid />
                 <PolarAngleAxis dataKey="skill" />
                 <PolarRadiusAxis angle={90} domain={[0, 100]} />
                 <Radar name="Umiejętności" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                 <Tooltip />
               </RadarChart>
             </ResponsiveContainer>
           </CardContent>
         </Card>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <AlertCircle className="w-5 h-5 text-yellow-500" />
                 Wymaga uwagi
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-3">
                 {student.weakPoints.map((point, index) => (
                   <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                     <div>
                       <p className="font-medium">{point.skill}</p>
                       <div className="flex items-center gap-2 mt-1">
                         <div className="flex gap-1">
                           {[...Array(5)].map((_, i) => (
                             <div
                               key={i}
                               className={`w-2 h-2 rounded-full ${
                                 i < point.level ? 'bg-yellow-500' : 'bg-gray-300'
                               }`}
                             />
                           ))}
                         </div>
                         <Badge variant="outline" className="text-xs">
                           {point.improvement}
                         </Badge>
                       </div>
                     </div>
                     <Target className="w-4 h-4 text-yellow-600" />
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <CheckCircle className="w-5 h-5 text-green-500" />
                 Mocne strony
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-3">
                 {student.strongPoints.map((point, index) => (
                   <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                     <div>
                       <p className="font-medium">{point.skill}</p>
                       <div className="flex items-center gap-2 mt-1">
                         <div className="flex gap-1">
                           {[...Array(5)].map((_, i) => (
                             <div
                               key={i}
                               className={`w-2 h-2 rounded-full ${
                                 i < point.level ? 'bg-green-500' : 'bg-gray-300'
                               }`}
                             />
                           ))}
                         </div>
                         {point.stable && (
                           <Badge variant="outline" className="text-xs">
                             Stabilny
                           </Badge>
                         )}
                       </div>
                     </div>
                     <Award className="w-4 h-4 text-green-600" />
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
         </div>
       </TabsContent>

       <TabsContent value="progress" className="mt-6 space-y-6">
         <Card>
           <CardHeader>
             <CardTitle>Dynamika nauki</CardTitle>
           </CardHeader>
           <CardContent>
             <ResponsiveContainer width="100%" height={300}>
               <AreaChart data={progressHistory}>
                 <defs>
                   <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="week" />
                 <YAxis />
                 <Tooltip />
                 <Area type="monotone" dataKey="progress" stroke="#3B82F6" fillOpacity={1} fill="url(#colorProgress)" />
               </AreaChart>
             </ResponsiveContainer>
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <CardTitle>Kamienie milowe</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="relative">
               <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
               <div className="space-y-6">
                 {student.milestones.map((milestone, index) => (
                   <div key={milestone.id} className="flex gap-4">
                     <div
                       className={`
                         w-4 h-4 rounded-full border-2 mt-1
                         ${milestone.completed
                           ? 'bg-green-500 border-green-500'
                           : 'bg-white border-gray-300'
                         }
                       `}
                     />
                     <div className="flex-1">
                       <div className="flex items-center justify-between">
                         <p className={`font-medium ${milestone.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                           {milestone.title}
                         </p>
                         <p className="text-sm text-gray-500">{milestone.date}</p>
                       </div>
                       {milestone.completed && (
                         <Badge variant="outline" className="mt-1">
                           <CheckCircle className="w-3 h-3 mr-1" />
                           Ukończone
                         </Badge>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </CardContent>
         </Card>
       </TabsContent>

       <TabsContent value="history" className="mt-6">
         <Card>
           <CardHeader>
             <CardTitle>Historia lekcji</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
               {lessonHistory.map((lesson) => (
                 <div key={lesson.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                   <div className="flex items-start justify-between mb-3">
                     <div>
                       <p className="font-semibold">{lesson.type}</p>
                       <p className="text-sm text-gray-500">{lesson.date} • {lesson.duration} min</p>
                     </div>
                     <div className="flex items-center gap-1">
                       {[...Array(5)].map((_, i) => (
                         <Star
                           key={i}
                           className={`w-4 h-4 ${
                             i < lesson.rating
                               ? 'fill-yellow-400 text-yellow-400'
                               : 'text-gray-300'
                           }`}
                         />
                       ))}
                     </div>
                   </div>
                   <div className="flex flex-wrap gap-2 mb-3">
                     {lesson.skills.map((skill, index) => (
                       <Badge key={index} variant="secondary">
                         {skill}
                       </Badge>
                     ))}
                   </div>
                   {lesson.notes && (
                     <p className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                       {lesson.notes}
                     </p>
                   )}
                 </div>
               ))}
             </div>
           </CardContent>
         </Card>
       </TabsContent>

       <TabsContent value="feedback" className="mt-6 space-y-6">
         <Card>
           <CardHeader>
             <CardTitle>Szybka ocena</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
               {Object.entries(student.skills).slice(0, 5).map(([skill, value]) => (
                 <div key={skill}>
                   <div className="flex justify-between mb-2">
                     <Label>{skill}</Label>
                     <span className="text-sm font-medium">{selectedSkills[skill] || value}/100</span>
                   </div>
                   <Slider
                     value={[selectedSkills[skill] || value]}
                     onValueChange={(vals) => setSelectedSkills(prev => ({...prev, [skill]: vals[0]}))}
                     max={100}
                     step={5}
                     className="w-full"
                   />
                 </div>
               ))}
             </div>
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <CardTitle>Szczegółowa ocena</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
               <div>
                 <Label>Ogólna ocena lekcji</Label>
                 <RadioGroup defaultValue="excellent" className="mt-2">
                   <div className="flex items-center space-x-2">
                     <RadioGroupItem value="excellent" id="excellent" />
                     <Label htmlFor="excellent">😊 Doskonale</Label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <RadioGroupItem value="good" id="good" />
                     <Label htmlFor="good">👍 Dobrze</Label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <RadioGroupItem value="satisfactory" id="satisfactory" />
                     <Label htmlFor="satisfactory">📚 Zadowalająco</Label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <RadioGroupItem value="needs-work" id="needs-work" />
                     <Label htmlFor="needs-work">⚠️ Wymaga pracy</Label>
                   </div>
                 </RadioGroup>
               </div>

               <div>
                 <Label>Komentarze i rekomendacje</Label>
                 <Textarea
                   placeholder="Opisz postęp kursanta, co się poprawiło, nad czym trzeba popracować..."
                   value={feedbackText}
                   onChange={(e) => setFeedbackText(e.target.value)}
                   className="mt-2 h-32"
                 />
               </div>

               <div className="flex gap-2">
                 <Button onClick={handleSaveFeedback} className="flex-1">
                   <Save className="w-4 h-4 mr-2" />
                   Zapisz ocenę
                 </Button>
                 <Button variant="outline">
                   <Share className="w-4 h-4 mr-2" />
                   Udostępnij kursantowi
                 </Button>
               </div>
             </div>
           </CardContent>
         </Card>
       </TabsContent>
     </Tabs>
   </div>
 )
}