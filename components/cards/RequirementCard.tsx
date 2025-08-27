// components/cards/RequirementCard.tsx

'use client';

import { CheckCircle2, Circle, AlertCircle, Lock } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/badge';

interface RequirementCardProps {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  mandatory: boolean;
  current?: number;
  required?: number;
  locked?: boolean;
  lockedReason?: string;
  deadline?: string;
}

export default function RequirementCard({
  name,
  description,
  completed,
  mandatory,
  current,
  required,
  locked = false,
  lockedReason,
  deadline
}: RequirementCardProps) {
  const hasProgress = current !== undefined && required !== undefined;
  const progressPercentage = hasProgress ? (current / required) * 100 : 0;

  if (locked) {
    return (
      <div className="relative p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-gray-500">{name}</p>
            {lockedReason && (
              <p className="text-sm text-gray-400 mt-1">{lockedReason}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border ${
      completed 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {completed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-300" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className={`font-medium ${
                  completed ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {name}
                </p>
                {mandatory && (
                  <Badge variant="outline" className="text-xs">
                    Obowiązkowe
                  </Badge>
                )}
              </div>
              
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
              
              {hasProgress && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Postęp</span>
                    <span className="text-xs font-medium">
                      {current}/{required}
                    </span>
                  </div>
                  <ProgressBar 
                    value={progressPercentage}
                    color={completed ? 'green' : progressPercentage >= 50 ? 'yellow' : 'red'}
                    size="sm"
                  />
                </div>
              )}
              
              {deadline && !completed && (
                <div className="flex items-center gap-1 mt-2">
                  <AlertCircle className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-yellow-600">
                    Termin: {deadline}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}