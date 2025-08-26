// File: /app/[locale]/(student)/student/loading.tsx
'use client';

import React from 'react';
import { Car, Loader2 } from 'lucide-react';

export default function StudentLoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center animate-pulse mx-auto">
            <Car className="w-12 h-12 text-blue-500" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Ładowanie...</h2>
          <p className="text-gray-600">Przygotowujemy wszystko dla Ciebie</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-loading-bar" />
          </div>
        </div>

        {/* Loading Tips */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="animate-fade-in-out">
                Czy wiesz, że możesz zarezerwować lekcję w mniej niż 30 sekund?
              </span>
            </div>
          </div>
        </div>

        {/* Skeleton Elements Preview */}
        <div className="mt-12 max-w-2xl mx-auto space-y-4 opacity-50">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 60%;
            margin-left: 20%;
          }
          100% {
            width: 100%;
            margin-left: 100%;
          }
        }

        @keyframes fade-in-out {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }

        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}