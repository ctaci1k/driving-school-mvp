// app\page.tsx

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Car, Calendar, Users, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold text-blue-600">DrivingSchool</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Learn to Drive with the Best Instructors
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Book your driving lessons online, track your progress, and pass your test with confidence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Book lessons that fit your schedule</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
              <p className="text-gray-600">Learn from certified professionals</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Modern Vehicles</h3>
              <p className="text-gray-600">Practice in well-maintained cars</p>
            </div>
          </div>

          <div className="mt-16 p-8 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Get Started Today</h3>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full md:w-auto">
                  Register as Student
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full md:w-auto">
                  Become an Instructor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}