import React, { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  ForwardIcon, 
  BackwardIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import Button from '../UI/Button';
import ProgressRing from '../UI/ProgressRing';

const WorkoutPlayer = ({ workout, onClose, onComplete }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [completedSets, setCompletedSets] = useState({});

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalExercises = workout.exercises.length;
  const progress = ((currentExerciseIndex + 1) / totalExercises) * 100;

  useEffect(() => {
    let interval;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            if (isResting) {
              setIsResting(false);
              setCurrentSet(prev => prev + 1);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, isResting]);

  const startTimer = (seconds) => {
    setTimeRemaining(seconds);
    setIsPlaying(true);
  };

  const toggleTimer = () => {
    setIsPlaying(!isPlaying);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      setIsPlaying(false);
      setTimeRemaining(0);
    } else {
      // Treino concluído
      onComplete();
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setCurrentSet(1);
      setIsResting(false);
      setIsPlaying(false);
      setTimeRemaining(0);
    }
  };

  const completeSet = () => {
    const exerciseId = currentExercise.id;
    const setKey = `${exerciseId}-${currentSet}`;
    
    setCompletedSets(prev => ({
      ...prev,
      [setKey]: true
    }));

    if (currentSet < currentExercise.sets) {
      // Iniciar descanso
      setIsResting(true);
      startTimer(currentExercise.rest);
    } else {
      // Exercício concluído, próximo exercício
      nextExercise();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isSetCompleted = (setNumber) => {
    const setKey = `${currentExercise.id}-${setNumber}`;
    return completedSets[setKey];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">{workout.name}</h2>
            <p className="text-sm text-gray-600">
              Exercício {currentExerciseIndex + 1} de {totalExercises}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Progress */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso do Treino</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Exercise Video/Image */}
        <div className="px-4">
          <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center mb-4">
            <div className="text-center">
              <PlayIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Vídeo do exercício</p>
              <p className="text-xs text-gray-500">{currentExercise.name}</p>
            </div>
          </div>
        </div>

        {/* Exercise Info */}
        <div className="px-4 mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {currentExercise.name}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{currentExercise.sets}</p>
              <p className="text-sm text-gray-600">Séries</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{currentExercise.reps}</p>
              <p className="text-sm text-gray-600">Repetições</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{currentExercise.rest}s</p>
              <p className="text-sm text-gray-600">Descanso</p>
            </div>
          </div>
        </div>

        {/* Timer */}
        {(timeRemaining > 0 || isResting) && (
          <div className="px-4 mb-4">
            <Card className="text-center">
              <div className="flex items-center justify-center mb-4">
                <ProgressRing 
                  progress={isResting ? ((currentExercise.rest - timeRemaining) / currentExercise.rest) * 100 : 0}
                  size={100}
                  strokeWidth={8}
                  color={isResting ? "#ef4444" : "#10b981"}
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatTime(timeRemaining)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {isResting ? 'Descanso' : 'Tempo'}
                    </p>
                  </div>
                </ProgressRing>
              </div>
              <Button
                variant={isPlaying ? "ghost" : "primary"}
                onClick={toggleTimer}
                icon={isPlaying ? PauseIcon : PlayIcon}
                className="w-full"
              >
                {isPlaying ? 'Pausar' : 'Continuar'}
              </Button>
            </Card>
          </div>
        )}

        {/* Sets */}
        <div className="px-4 mb-4">
          <h4 className="font-semibold text-gray-900 mb-3">
            Série {currentSet} de {currentExercise.sets}
          </h4>
          <div className="flex gap-2 mb-4">
            {Array.from({ length: currentExercise.sets }, (_, index) => {
              const setNumber = index + 1;
              const isCompleted = isSetCompleted(setNumber);
              const isCurrent = setNumber === currentSet;
              
              return (
                <div
                  key={setNumber}
                  className={`flex-1 h-3 rounded-full transition-all duration-200 ${
                    isCompleted 
                      ? 'bg-green-500' 
                      : isCurrent 
                        ? 'bg-yellow-500' 
                        : 'bg-gray-200'
                  }`}
                />
              );
            })}
          </div>
          
          {!isResting && (
            <div className="space-y-2">
              <Button
                variant="secondary"
                onClick={() => startTimer(currentExercise.rest)}
                className="w-full"
              >
                Iniciar Descanso ({currentExercise.rest}s)
              </Button>
              <Button
                variant="primary"
                onClick={completeSet}
                icon={CheckCircleIcon}
                className="w-full"
              >
                Série Concluída
              </Button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-2 p-4 border-t">
          <Button
            variant="ghost"
            onClick={previousExercise}
            disabled={currentExerciseIndex === 0}
            icon={BackwardIcon}
            className="flex-1"
          >
            Anterior
          </Button>
          <Button
            variant="ghost"
            onClick={nextExercise}
            icon={ForwardIcon}
            className="flex-1"
          >
            {currentExerciseIndex === totalExercises - 1 ? 'Finalizar' : 'Próximo'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlayer;

