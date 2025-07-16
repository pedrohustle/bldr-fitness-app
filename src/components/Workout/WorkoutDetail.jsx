import React from 'react';
import { 
  ClockIcon, 
  FireIcon,
  PlayIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import Button from '../UI/Button';

const WorkoutDetail = ({ workout, onClose, onStart, isCompleted }) => {
  const totalCalories = workout.exercises.length * 50; // Estimativa simples

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{workout.name}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>{workout.duration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <FireIcon className="w-4 h-4" />
                <span>{totalCalories} kcal</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Tags */}
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {workout.level}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {workout.objective}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              {workout.type}
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
              {workout.biotipo}
            </span>
          </div>
        </div>

        {/* Exercises List */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Exercícios ({workout.exercises.length})
          </h3>
          
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => (
              <Card key={exercise.id} className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-gray-900">
                      {index + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {exercise.name}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{exercise.sets} séries</span>
                      <span>{exercise.reps} reps</span>
                      <span>{exercise.rest}s descanso</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t space-y-2">
          <Button
            variant={isCompleted ? "ghost" : "primary"}
            onClick={onStart}
            icon={isCompleted ? CheckCircleIcon : PlayIcon}
            className="w-full"
          >
            {isCompleted ? 'Treino Concluído' : 'Iniciar Treino'}
          </Button>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Fechar
          </Button>
        </div>

        {/* Tips */}
        <div className="p-4 bg-gray-50 rounded-b-2xl">
          <h4 className="font-semibold text-gray-900 mb-2">💡 Dicas</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Mantenha a forma correta em todos os exercícios</li>
            <li>• Hidrate-se durante o treino</li>
            <li>• Respeite os tempos de descanso</li>
            <li>• Ajuste o peso conforme sua capacidade</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;

