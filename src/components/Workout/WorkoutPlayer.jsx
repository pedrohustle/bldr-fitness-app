import React, { useState, useEffect } from 'react';
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import ProgressRing from '../ui/ProgressRing';

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

  // Detecta se o treino é HIIT (objetivo "emagrecimento") para ajustar comportamento
  const isHIIT = workout.objective === 'emagrecimento';

  // Para HIIT, reps vem em segundos (ex: "30s"), então convertemos para número para usar timer
  const parseRepsTime = (reps) => {
    if (!reps) return 0;
    if (typeof reps === 'string' && reps.endsWith('s')) {
      const num = parseInt(reps.replace('s', ''), 10);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  // Duração do tempo ativo (repouso entre reps no HIIT não usado aqui)
  const activeTime = isHIIT ? parseRepsTime(currentExercise.reps) : 0;

  useEffect(() => {
    let interval;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            if (isResting) {
              setIsResting(false);
              // Para ABC, incrementa série; para HIIT, só avança (geralmente uma série é 1 ciclo no HIIT)
              if (!isHIIT) {
                setCurrentSet(prevSet => prevSet + 1);
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, isResting, isHIIT]);

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
    setCompletedSets(prev => ({ ...prev, [setKey]: true }));

    if (isHIIT) {
      // No HIIT, a "série" é o tempo do exercício; vai direto para próximo exercício
      nextExercise();
    } else {
      // ABC: se ainda tem séries, inicia descanso; senão, vai pro próximo exercício
      if (currentSet < currentExercise.sets) {
        setIsResting(true);
        startTimer(currentExercise.rest);
      } else {
        nextExercise();
      }
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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex-1 text-center">
            <h2 className="text-xl font-bold text-gray-900">{workout.name}</h2>
            <p className="text-sm text-gray-500">
              Exercício {currentExerciseIndex + 1} de {totalExercises}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-5 mt-4">
          <div className="flex justify-between text-sm text-gray-700 mb-1">
            <span>Progresso do Treino</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-yellow-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Imagem/Preview */}
        <div className="p-5">
          <div className="aspect-video bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-500">
            <PlayIcon className="w-12 h-12 mb-2" />
            <p className="text-sm">{currentExercise.name}</p>
          </div>

          {/* Informações do exercício logo abaixo do vídeo */}
          <div className="px-5 mb-6 grid grid-cols-3 text-center text-gray-800">
            <div>
              <p className="text-lg font-semibold">
                {isHIIT ? 'N/A' : currentExercise.sets ?? 'N/A'}
              </p>
              <p className="text-xs text-gray-500">Séries</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{currentExercise.reps ?? 'N/A'}</p>
              <p className="text-xs text-gray-500">Repetições</p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {currentExercise.rest ? `${currentExercise.rest}s` : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">Descanso</p>
            </div>
          </div>
        </div>

        {/* Timer */}
        {(timeRemaining > 0 || isResting) && (
          <div className="px-5 mb-4">
            <Card className="text-center py-6">
              <div className="flex items-center justify-center mb-4">
                <ProgressRing
                  progress={
                    isResting
                      ? ((currentExercise.rest - timeRemaining) / currentExercise.rest) * 100
                      : ((activeTime - timeRemaining) / activeTime) * 100
                  }
                  size={100}
                  strokeWidth={8}
                  color={isResting ? '#ef4444' : '#10b981'}
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{formatTime(timeRemaining)}</p>
                    <p className="text-xs text-gray-500">{isResting ? 'Descanso' : 'Tempo'}</p>
                  </div>
                </ProgressRing>
              </div>
              <Button
                variant={isPlaying ? 'ghost' : 'primary'}
                onClick={toggleTimer}
                icon={isPlaying ? PauseIcon : PlayIcon}
                className="w-full"
              >
                {isPlaying ? 'Pausar' : 'Continuar'}
              </Button>
            </Card>
          </div>
        )}

        {/* Sets (mostrar só para ABC, para HIIT ocultar) */}
        {!isHIIT && (
          <div className="px-5 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Série {currentSet} de {currentExercise.sets}
            </h4>
            <div className="flex gap-2 mb-4">
              {Array.from({ length: currentExercise.sets }, (_, index) => {
                const setNumber = index + 1;
                const completed = isSetCompleted(setNumber);
                const isCurrent = setNumber === currentSet;
                return (
                  <div
                    key={setNumber}
                    className={`flex-1 h-3 rounded-full ${
                      completed ? 'bg-green-500' : isCurrent ? 'bg-yellow-500' : 'bg-gray-200'
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
                  className="bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-gray-900 font-semibold rounded-lg px-4 py-3 text-base w-full transition-all duration-200 flex items-center justify-center gap-2"
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
        )}

        {/* Para HIIT, mostrar botão para avançar exercício (já que não tem sets) */}
        {isHIIT && !isResting && timeRemaining === 0 && (
          <div className="px-5 mb-4">
            <Button
              variant="primary"
              onClick={completeSet}
              icon={CheckCircleIcon}
              className="w-full"
            >
              Concluir Exercício
            </Button>
          </div>
        )}

        {/* Navegação */}
        <div className="flex gap-2 p-5 border-t border-gray-200">
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
