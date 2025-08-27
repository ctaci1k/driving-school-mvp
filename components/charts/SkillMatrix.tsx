// components/charts/SkillMatrix.tsx

'use client';

import ProgressBar from '@/components/ui/ProgressBar';

interface Skill {
  name: string;
  score: number;
  required: number;
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}

interface SkillMatrixProps {
  categories: SkillCategory[];
}

export default function SkillMatrix({ categories }: SkillMatrixProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">{category.name}</h3>
          <div className="space-y-3">
            {category.skills.map((skill, skillIndex) => {
              const isPassing = skill.score >= skill.required;
              
              return (
                <div key={skillIndex}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        isPassing ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {skill.score}%
                      </span>
                      {isPassing && (
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <ProgressBar 
                      value={skill.score} 
                      color={isPassing ? 'green' : 'red'}
                      size="sm"
                    />
                    {/* Required threshold marker */}
                    <div 
                      className="absolute top-0 w-0.5 h-2 bg-gray-800"
                      style={{ left: `${skill.required}%` }}
                      title={`Wymagane: ${skill.required}%`}
                    />
                  </div>
                  
                  {!isPassing && (
                    <p className="text-xs text-gray-500 mt-1">
                      Brakuje {skill.required - skill.score}% do wymaganego poziomu
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Category summary */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Średnia kategorii</span>
              <span className="font-medium text-gray-900">
                {Math.round(
                  category.skills.reduce((acc, skill) => acc + skill.score, 0) / category.skills.length
                )}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}