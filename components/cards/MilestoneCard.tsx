// components/cards/MilestoneCard.tsx

'use client';

import { CheckCircle2, Circle, Calendar } from 'lucide-react';

interface MilestoneCardProps {
  title: string;
  completed: boolean;
  date: string | null;
  isLast?: boolean;
  description?: string;
}

export default function MilestoneCard({ 
  title, 
  completed, 
  date, 
  isLast = false,
  description 
}: MilestoneCardProps) {
  return (
    <div className="relative flex items-start gap-4">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-5 top-10 w-0.5 h-full bg-gray-200" />
      )}
      
      {/* Icon */}
      <div className="relative z-10 flex-shrink-0">
        {completed ? (
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Circle className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`font-medium ${
                completed ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {title}
              </h4>
              
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
              
              {date && (
                <div className="flex items-center gap-1 mt-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {new Date(date).toLocaleDateString('pl-PL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
            
            {completed && (
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                Ukończony
              </span>
            )}
            
            {!completed && !date && (
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                Oczekuje
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}