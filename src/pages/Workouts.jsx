import React, { useState } from 'react';
import { 
  FunnelIcon, 
  ClockIcon, 
  FireIcon,
  PlayIcon,
  CheckCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import WorkoutPlayer from '../components/Workout/WorkoutPlayer';
import WorkoutDetail from '../components/Workout/WorkoutDetail';
import Achievement from '../components/Gamification/Achievement';
import { workouts, workoutFilters } from '../data/workouts';
import { achievements, checkAchievements } from '../data/achievements';

const Workouts = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    level: '',
    objective: '',
    type: '',
    biotipo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [completedWorkouts, setCompletedWorkouts] = useState(new Set());
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showWorkoutDetail, setShowWorkoutDetail] = useState(false);
  const [showWorkoutPlayer, setShowWorkoutPlayer] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [userProgress, setUserProgress] = useState({
    workoutsCompleted: 0,
    currentStreak: 0,
    totalXP: 0,
    unlockedAchievements: []
  });

  const filteredWorkouts = workouts.filter(workout => {
    return (
      (!selectedFilters.level || workout.level === selectedFilters.level) &&
      (!selectedFilters.objective || workout.objective === selectedFilters.objective) &&
      (!selectedFilters.type || workout.type === selectedFilters.type) &&
      (!selectedFilters.biotipo || workout.biotipo === selectedFilters.biotipo)
    );
  });

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value
    }));
  };

  const markWorkoutCompleted = (workoutId) => {
    setCompletedWorkouts(prev => new Set([...prev, workoutId]));
    
    // Atualizar progresso do usuário
    const newProgress = {
      ...userProgress,
      workoutsCompleted: userProgress.workoutsCompleted + 1,
      currentStreak: userProgress.currentStreak + 1,
      totalXP: userProgress.totalXP + 100 // XP base por treino
    };
    
    // Verificar novas conquistas
    const newAchievements = checkAchievements(userProgress, newProgress);
    
    if (newAchievements.length > 0) {
      // Adicionar XP das conquistas
      const achievementXP = newAchievements.reduce((total, achievement) => total + achievement.points, 0);
      newProgress.totalXP += achievementXP;
      newProgress.unlockedAchievements = [
        ...(userProgress.unlockedAchievements || []),
        ...newAchievements.map(a => a.id)
      ];
      
      // Mostrar primeira conquista
      setNewAchievement(newAchievements[0]);
    }
    
    setUserProgress(newProgress);
  };

  const startWorkout = (workout) => {
    setSelectedWorkout(workout);
    setShowWorkoutDetail(false);
    setShowWorkoutPlayer(true);
  };

  const showDetails = (workout) => {
    setSelectedWorkout(workout);
    setShowWorkoutDetail(true);
  };

  const closeModals = () => {
    setShowWorkoutDetail(false);
    setShowWorkoutPlayer(false);
    setSelectedWorkout(null);
  };

  const completeWorkout = () => {
    if (selectedWorkout) {
      markWorkoutCompleted(selectedWorkout.id);
      closeModals();
    }
  };

  const FilterButton = ({ label, value, filterType, isSelected }) => (
    <button
      onClick={() => handleFilterChange(filterType, value)}
      className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        isSelected
          ? 'bg-yellow-500 text-gray-900'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Treinos</h1>
            <p className="text-gray-300">Construa seu corpo ideal</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            icon={FunnelIcon}
            className="text-white hover:bg-white/10"
          >
            Filtros
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">{userProgress.workoutsCompleted}</p>
            <p className="text-xs text-gray-300">Treinos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">{userProgress.currentStreak}</p>
            <p className="text-xs text-gray-300">Sequência</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">{userProgress.totalXP}</p>
            <p className="text-xs text-gray-300">XP Total</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Filtros */}
        {showFilters && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Filtrar Treinos</h3>
            
            <div className="space-y-4">
              {/* Nível */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Nível</p>
                <div className="flex flex-wrap gap-2">
                  {workoutFilters.levels.map(level => (
                    <FilterButton
                      key={level}
                      label={level.charAt(0).toUpperCase() + level.slice(1)}
                      value={level}
                      filterType="level"
                      isSelected={selectedFilters.level === level}
                    />
                  ))}
                </div>
              </div>

              {/* Objetivo */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Objetivo</p>
                <div className="flex flex-wrap gap-2">
                  {workoutFilters.objectives.map(objective => (
                    <FilterButton
                      key={objective}
                      label={objective.charAt(0).toUpperCase() + objective.slice(1)}
                      value={objective}
                      filterType="objective"
                      isSelected={selectedFilters.objective === objective}
                    />
                  ))}
                </div>
              </div>

              {/* Tipo */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Local</p>
                <div className="flex flex-wrap gap-2">
                  {workoutFilters.types.map(type => (
                    <FilterButton
                      key={type}
                      label={type.charAt(0).toUpperCase() + type.slice(1)}
                      value={type}
                      filterType="type"
                      isSelected={selectedFilters.type === type}
                    />
                  ))}
                </div>
              </div>

              {/* Biotipo */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Biotipo</p>
                <div className="flex flex-wrap gap-2">
                  {workoutFilters.biotypes.map(biotipo => (
                    <FilterButton
                      key={biotipo}
                      label={biotipo.charAt(0).toUpperCase() + biotipo.slice(1)}
                      value={biotipo}
                      filterType="biotipo"
                      isSelected={selectedFilters.biotipo === biotipo}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de treinos */}
        <div className="space-y-4">
          {filteredWorkouts.map(workout => {
            const isCompleted = completedWorkouts.has(workout.id);
            
            return (
              <Card key={workout.id} hover className="relative">
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {workout.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{workout.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FireIcon className="w-4 h-4" />
                        <span>{workout.exercises.length} exercícios</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {workout.level}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {workout.objective}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {workout.type}
                  </span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    {workout.biotipo}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={isCompleted ? "ghost" : "primary"}
                    size="sm"
                    className="flex-1"
                    icon={isCompleted ? CheckCircleIcon : PlayIcon}
                    onClick={() => !isCompleted && startWorkout(workout)}
                  >
                    {isCompleted ? 'Concluído' : 'Iniciar Treino'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-4"
                    icon={EyeIcon}
                    onClick={() => showDetails(workout)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredWorkouts.length === 0 && (
          <Card>
            <div className="text-center py-8">
              <FireIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum treino encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros para encontrar treinos adequados.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Modals */}
      {showWorkoutDetail && selectedWorkout && (
        <WorkoutDetail
          workout={selectedWorkout}
          onClose={closeModals}
          onStart={() => startWorkout(selectedWorkout)}
          isCompleted={completedWorkouts.has(selectedWorkout.id)}
        />
      )}

      {showWorkoutPlayer && selectedWorkout && (
        <WorkoutPlayer
          workout={selectedWorkout}
          onClose={closeModals}
          onComplete={completeWorkout}
        />
      )}

      {newAchievement && (
        <Achievement
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}
    </div>
  );
};

export default Workouts;

