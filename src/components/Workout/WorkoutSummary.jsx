import React from 'react';
import { Button } from '../ui/button';
import { PlayIcon } from '@heroicons/react/24/outline';

const WorkoutSummary = ({ workout, onStart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-xl font-bold text-gray-900">{workout.name}</h3>
      <div className="flex text-sm text-gray-600 gap-6">
        <span><strong>Duração:</strong> {workout.duration} min</span>
        <span><strong>Exercícios:</strong> {workout.exercises.length}</span>
      </div>

      <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
        {workout.exercises.map((ex, i) => (
          <li key={ex.id} className="py-2">
            <div className="font-semibold">{i + 1}. {ex.name}</div>
            <div className="text-gray-600 text-sm">
              {ex.sets} x {ex.reps} — descanso {ex.rest}s
            </div>
          </li>
        ))}
      </ul>

      <Button
        variant="primary"
        icon={PlayIcon}
        className="w-full"
        onClick={() => onStart(workout)}
      >
        Iniciar Treino
      </Button>
    </div>
  );
};

export default WorkoutSummary;
